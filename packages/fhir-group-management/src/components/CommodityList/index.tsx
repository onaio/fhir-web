import React from 'react';
import { Space, Button, Divider, Dropdown, Menu, Popconfirm } from 'antd';
import { parseGroup } from '../BaseComponents/GroupDetail';
import { MoreOutlined } from '@ant-design/icons';
import { ADD_EDIT_COMMODITY_URL, groupResourceType, listResourceType } from '../../constants';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../mls';
import { BaseListView, BaseListViewProps, TableData } from '../BaseComponents/BaseGroupsListView';
import { TFunction } from '@opensrp/i18n';
import {
  FHIRServiceClass,
  SingleKeyNestedValue,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { get } from 'lodash';
import {
  getUnitMeasureCharacteristic,
  supplyMgSnomedCode,
  snomedCodeSystem,
} from '../..//helpers/utils';
import { useQueryClient } from 'react-query';
import {
  sendErrorNotification,
  sendInfoNotification,
  sendSuccessNotification,
} from '@opensrp/notifications';

interface GroupListProps {
  fhirBaseURL: string;
  listId: string; // commodities are added to list resource with this id
}

const keyValueDetailRender = (obj: IGroup, t: TFunction) => {
  const { name, active, id, identifier } = parseGroup(obj);

  const unitMeasureCharacteristic = getUnitMeasureCharacteristic(obj);

  const keyValues = {
    [t('Commodity Id')]: id,
    [t('Identifier')]: identifier,
    [t('Name')]: name,
    [t('Active')]: active ? t('Active') : t('Disabled'),
    [t('Unit of measure')]: get(unitMeasureCharacteristic, 'valueCodeableConcept.text'),
  };

  return (
    <Space direction="vertical">
      {Object.entries(keyValues).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
    </Space>
  );
};

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const CommodityList = (props: GroupListProps) => {
  const { fhirBaseURL, listId } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { addParam } = useSearchParams();

  const getColumns = (t: TFunction) => [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? t('Active') : t('Disabled')}</div>,
    },
    {
      title: t('type'),
      dataIndex: 'type' as const,
      key: 'type' as const,
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${ADD_EDIT_COMMODITY_URL}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item key="view-details" className="view-details">
                  <Button onClick={() => addParam(viewDetailsQuery, record.id)} type="link">
                    {t('View Details')}
                  </Button>
                </Menu.Item>
                <Menu.Item key="delete">
                  <Popconfirm
                    title={t('Are you sure you want to delete this Commodity?')}
                    okText={t('Yes')}
                    cancelText={t('No')}
                    onConfirm={async () => {
                      deleteCommodity(fhirBaseURL, record.obj, listId)
                        .then(() => {
                          queryClient.invalidateQueries([groupResourceType]).catch(() => {
                            sendInfoNotification(
                              t('Unable to refresh data at the moment, please refresh the page')
                            );
                          });
                          sendSuccessNotification(t('Successfully deleted commodity'));
                        })
                        .catch(() => {
                          sendErrorNotification(t('Deletion of commodity failed'));
                        });
                    }}
                  >
                    <Button danger type="link" style={{ color: '#' }}>
                      {t('Delete')}
                    </Button>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" rev={undefined} />
          </Dropdown>
        </span>
      ),
    },
  ];

  const baseListViewProps: BaseListViewProps = {
    getColumns: getColumns,
    keyValueMapperRenderProp: keyValueDetailRender,
    createButtonLabel: t('Add Commodity'),
    createButtonUrl: ADD_EDIT_COMMODITY_URL,
    fhirBaseURL,
    pageTitle: t('Commodity List'),
    extraQueryFilters: {
      code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
      '_has:List:item:_id': listId,
    },
  };

  return <BaseListView {...baseListViewProps} />;
};

/**
 * Soft deletes a commodity resource. Sets its active to false and removes it from the
 * list resource.
 *
 * @param fhirBaseURL - base url to fhir server
 * @param obj - commodity resource to be disabled
 * @param listId - id of list resource where this was referenced.
 */
export const deleteCommodity = async (fhirBaseURL: string, obj: IGroup, listId: string) => {
  if (!listId) {
    throw new Error('List id is not configured correctly');
  }
  const disabledGroup: IGroup = {
    ...obj,
    active: false,
  };
  const serve = new FHIRServiceClass<IGroup>(fhirBaseURL, groupResourceType);
  const listServer = new FHIRServiceClass<IList>(fhirBaseURL, listResourceType);
  const list = await listServer.read(listId);
  const leftEntries = (list.entry ?? []).filter((entry) => {
    return entry.item.reference !== `${groupResourceType}/${obj.id}`;
  });
  const listPayload = {
    ...list,
    entry: leftEntries,
  };
  return listServer.update(listPayload).then(() => {
    return serve.update(disabledGroup);
  });
};
