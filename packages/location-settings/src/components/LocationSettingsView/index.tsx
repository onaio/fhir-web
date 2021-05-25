/* eslint-disable @typescript-eslint/camelcase */
import { MoreOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin, Dropdown, Menu } from 'antd';
import {
  Tree,
  generateJurisdictionTree,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp/location-management';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { Setting } from '../../ducks/settings';
import { POP_CHARACTERISTICS_PARAM, SECURITY_AUTHENTICATE_ENDPOINT } from '../../constants';
import { useQuery, useQueryClient } from 'react-query';
import { Table } from './Table';

export interface Props {
  baseURL: string;
  restBaseURL: string;
  v2BaseURL: string;
}

export const LocationSettingsView: React.FC<Props> = (props: Props) => {
  const { baseURL, v2BaseURL } = props;
  const [currentLocId, setCurrentLocId] = useState<string>('');
  const [treeData, setTreeData] = useState<ParsedHierarchyNode[]>([]);

  const queryClient = useQueryClient();

  const userLocSettings = useQuery(
    SECURITY_AUTHENTICATE_ENDPOINT,
    () => new OpenSRPService(SECURITY_AUTHENTICATE_ENDPOINT, baseURL).list(),
    {
      onError: () => sendErrorNotification('ERROR OCCURRED'),
      select: (res: { locations: RawOpenSRPHierarchy }) => res.locations,
    }
  );

  useEffect(() => {
    if (userLocSettings.data) {
      const processedHierarchy = generateJurisdictionTree(userLocSettings.data).model;
      setTreeData([processedHierarchy]);
      const { map: userLocMap } = userLocSettings.data.locationsHierarchy;
      setCurrentLocId(Object.keys(userLocMap)[0]);
    }
  }, [userLocSettings.data, setTreeData, setCurrentLocId]);

  const locationSettings = useQuery(
    ['settings', currentLocId],
    () =>
      new OpenSRPService('settings', v2BaseURL).list({
        identifier: POP_CHARACTERISTICS_PARAM,
        locationId: currentLocId,
        resolve: true,
        serverVersion: 0,
      }),
    {
      onError: () => sendErrorNotification('ERROR OCCURRED'),
      select: (res: Setting[]) => res,
    }
  );

  if (!locationSettings.data?.length) return <Spin size="large" />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h5 className="mb-3">{'Settings'}</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentLocId(node.id)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <div className="bg-white p-3">
            <Table
              data={locationSettings.data}
              tree={treeData}
              actioncolumn={{
                title: 'Actions',
                key: `actions`,
                // eslint-disable-next-line react/display-name
                render: (_, row: Setting) => {
                  return (
                    <Dropdown
                      overlay={
                        <Menu className="menu">
                          <Menu.Item
                            onClick={async () => {
                              const payload = { ...row, value: 'true', locationId: currentLocId };
                              await new OpenSRPService(`settings/${currentLocId}`, v2BaseURL)
                                .update(payload)
                                .catch(() => sendErrorNotification('ERROR OCCURRED'));

                              await queryClient
                                .invalidateQueries([['settings', currentLocId]])
                                .catch(() => sendErrorNotification('Cant Invalidate'));

                              sendSuccessNotification('sucessfully Updated');
                            }}
                          >
                            Yes
                          </Menu.Item>
                          <Menu.Item
                            onClick={async () => {
                              const payload = { ...row, value: 'true', locationId: currentLocId };
                              await new OpenSRPService(`settings/${currentLocId}`, v2BaseURL)
                                .update(payload)
                                .catch(() => sendErrorNotification('ERROR OCCURRED'));

                              await queryClient
                                .invalidateQueries([['settings', currentLocId]])
                                .catch(() => sendErrorNotification('Cant Invalidate'));

                              sendSuccessNotification('sucessfully Updated');
                            }}
                          >
                            No
                          </Menu.Item>
                          <Menu.Item>Inherit</Menu.Item>
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

export default LocationSettingsView;
