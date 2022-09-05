import React from 'react';
import { Space, Button, Divider, Dropdown, Menu } from 'antd';
import { parseGroup } from '../BaseComponents/GroupDetail';
import { MoreOutlined } from '@ant-design/icons';
import { ADD_EDIT_COMMODITY_URL, LIST_COMMODITY_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../mls';
import { BaseListView, BaseListViewProps, TableData } from '../BaseComponents/BaseGroupsListView';
import { TFunction } from '@opensrp/i18n';
import { getObjLike, SingleKeyNestedValue } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { get } from 'lodash';

interface GroupListProps {
  fhirBaseURL: string;
}

// TODO - this is duplicated in the add-edit commodity pr util file. varName - defaultCharacteristic.
const groupCodeOfInterestSystem = 'http://snomed.info/sct';
const groupCodeOfInterestCode = '767524001';
const groupCodeOfInterest = {
  coding: [
    {
      system: groupCodeOfInterestSystem,
      code: groupCodeOfInterestCode,
      display: 'Unit of measure',
    },
  ],
};

const keyValueDetailRender = (obj: IGroup, t: TFunction) => {
  const { name, active } = parseGroup(obj);
  const unitMeasureCharacteristic = getObjLike(obj.characteristic, 'code', groupCodeOfInterest);

  const keyValues = {
    [t('Name')]: name,
    [t('Active')]: active ? t('Active') : t('Disabled'),
    [t('Unit of measure')]: get(unitMeasureCharacteristic, '0.valueCodeableConcept.text'),
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
  const { fhirBaseURL } = props;

  const { t } = useTranslation();

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
                  <Link to={`${LIST_COMMODITY_URL}/${record.id}`}>{t('View Details')}</Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const baseListViewProps: BaseListViewProps = {
    getColumns: getColumns,
    keyValueMapperRenderProp: keyValueDetailRender,
    createButtonLabel: t('Create Commodity'),
    createButtonUrl: ADD_EDIT_COMMODITY_URL,
    fhirBaseURL,
    pageTitle: t('Commodity List'),
    extraQueryFilters: {
      code: `${groupCodeOfInterestSystem}|${groupCodeOfInterestCode}`,
    },
  };

  return <BaseListView {...baseListViewProps} />;
};
