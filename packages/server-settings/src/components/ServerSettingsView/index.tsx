/* eslint-disable @typescript-eslint/naming-convention */
import { MoreOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin, Dropdown, Menu, PageHeader } from 'antd';
import {
  Tree,
  generateJurisdictionTree,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp/location-management';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { BrokenPage, OpenSRPService } from '@opensrp/react-utils';
import { Setting } from '../../ducks/settings';
import {
  POP_CHARACTERISTICS_PARAM,
  SECURITY_AUTHENTICATE_ENDPOINT,
  SETTINGS_ENDPOINT,
} from '../../constants';
import { useQuery, useQueryClient } from 'react-query';
import { Table } from './Table';
import { useTranslation } from '../../mls';

export interface Props {
  baseURL: string;
  restBaseURL: string;
  v2BaseURL: string;
}

export const ServerSettingsView: React.FC<Props> = (props: Props) => {
  const { baseURL, v2BaseURL } = props;
  const [currentLocId, setCurrentLocId] = useState<string>('');
  const [treeData, setTreeData] = useState<ParsedHierarchyNode[]>([]);
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const updateSettings = async (row: Setting, currentLocId: string, valueIsYes: boolean) => {
    const payload = { ...row, value: valueIsYes ? 'true' : 'false', locationId: currentLocId };
    const serve = new OpenSRPService(`${SETTINGS_ENDPOINT}/${row.settingMetadataId}`, v2BaseURL);
    await serve
      .update(payload)
      .catch(() => sendErrorNotification(t('An error occurred')))
      .then(() => {
        queryClient
          .invalidateQueries([SETTINGS_ENDPOINT, currentLocId])
          .catch(() => sendErrorNotification(t('Cant Invalidate')));

        sendSuccessNotification(t('Successfully Updated'));
      });
  };

  const { isError: isUserLocSettingsError, isLoading: isUserLocSettingsLoading } = useQuery(
    SECURITY_AUTHENTICATE_ENDPOINT,
    () => new OpenSRPService(SECURITY_AUTHENTICATE_ENDPOINT, baseURL).list(),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res: { locations: RawOpenSRPHierarchy }) => res.locations,
      onSuccess: (userLocSettings) => {
        const processedHierarchy = generateJurisdictionTree(userLocSettings).model;
        setTreeData([processedHierarchy]);
        const { map: userLocMap } = userLocSettings.locationsHierarchy;
        setCurrentLocId(Object.keys(userLocMap)[0]);
      },
    }
  );

  const {
    isError: isServerSettingsError,
    isLoading: isServerSettingsLoading,
    data: serverSettingsData,
  } = useQuery(
    [SETTINGS_ENDPOINT, currentLocId],
    async () =>
      await new OpenSRPService(SETTINGS_ENDPOINT, v2BaseURL).list({
        identifier: POP_CHARACTERISTICS_PARAM,
        locationId: currentLocId,
        resolve: true,
        serverVersion: 0,
      }),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res: Setting[]) => res,
      enabled: !!currentLocId.length,
    }
  );

  if (isServerSettingsError || isUserLocSettingsError) {
    return <BrokenPage />;
  }

  if (isServerSettingsLoading || isUserLocSettingsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  return (
    <section className="content-section">
      <Helmet>
        <title>{t('Settings')}</title>
      </Helmet>
      <PageHeader className="page-header" title={t('Settings')} />
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentLocId(node.id)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <div className="bg-white p-3">
            <Table
              data={serverSettingsData ?? []}
              tree={treeData}
              actioncolumn={{
                title: t('Actions'),
                key: `actions`,
                // eslint-disable-next-line react/display-name
                render: (_, row: Setting) => {
                  return (
                    <Dropdown
                      overlay={
                        <Menu className="menu">
                          <Menu.Item
                            onClick={async () => {
                              await updateSettings(row, currentLocId, true);
                            }}
                          >
                            {t('Yes')}
                          </Menu.Item>
                          <Menu.Item
                            onClick={async () => {
                              await updateSettings(row, currentLocId, false);
                            }}
                          >
                            {t('No')}
                          </Menu.Item>
                          <Menu.Item
                            onClick={async () => {
                              await new OpenSRPService(
                                `${SETTINGS_ENDPOINT}/${row.settingMetadataId}`,
                                v2BaseURL
                              )
                                .delete()
                                .catch(() => sendErrorNotification(t('An error occurred')))
                                .then(() => {
                                  queryClient
                                    .invalidateQueries([SETTINGS_ENDPOINT, currentLocId])
                                    .catch(() => sendErrorNotification(t('Cant Invalidate')));

                                  sendSuccessNotification(t('Successfully Updated'));
                                });
                            }}
                          >
                            {t('Inherit')}
                          </Menu.Item>
                        </Menu>
                      }
                      placement="bottomLeft"
                      arrow
                      trigger={['click']}
                    >
                      <MoreOutlined className="more-options" />
                    </Dropdown>
                  );
                },
                width: '10%',
              }}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default ServerSettingsView;
