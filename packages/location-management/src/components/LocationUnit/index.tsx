import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail from '../LocationDetail';
import Tree, { tree } from './Tree';
import Table, { data } from './Table';
import { Store } from 'redux';
import { connect } from 'react-redux';

import {
  KeycloakUser,
  getKeycloakUsersArray,
  getAccessToken,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '@opensrp/store';

export interface Props {
  data: data[];
  tree: tree[];
  accessToken: string;
}

const LocationUnit: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<data | null>(null);

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={props.tree} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Button type="primary">
                <PlusOutlined />
                Add location unit
              </Button>
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Logout</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button shape="circle" icon={<SettingOutlined />} type="text" />
              </Dropdown>
            </div>
          </div>
          <div className="bg-white p-4">
            <Form form={form} component={false}>
              <Table data={props.data} accessToken={props.accessToken} />
            </Form>
          </div>
        </Col>

        {detail && (
          <Col className="pl-3" span={5}>
            <LocationDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        )}
      </Row>
    </section>
  );
};

export { LocationUnit };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
  tableData: data[];
  tree: tree[];
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = getAccessToken(state) as string;
  const tableData: data[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      level: i,
      lastupdated: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
      status: 'Alive',
      type: 'Feautire',
      created: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
      externalid: `asdkjh123${i}`,
      openmrsid: `asdasdasdkjh123${i}`,
      username: `edward ${i}`,
      version: `${i}`,
      syncstatus: 'Synced',
    });
  }

  const tree: tree[] = [
    {
      title: 'Sierra Leone',
      key: 'Sierra Leone',
      children: [
        { title: 'Bo', key: 'Bo', children: [{ title: '1', key: '1' }] },
        { title: 'Bombali', key: 'Bombali', children: [{ title: '2', key: '2' }] },
        {
          title: 'Bonthe',
          key: 'Bonthe',
          children: [
            {
              title: 'Kissi Ten',
              key: 'Kissi Ten',
              children: [{ title: 'Bayama CHP', key: 'Bayama CHP' }],
            },
          ],
        },
      ],
    },
  ];
  return {
    keycloakUsers,
    accessToken,
    tableData,
    tree,
  };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

const ConnectedLocationUnit = connect(mapStateToProps, mapDispatchToProps)(LocationUnit);
export default ConnectedLocationUnit;
