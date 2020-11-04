import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail, { Props as LocationDetailData } from '../LocationDetail';
import Tree, { TreeData } from './Tree';
import Table, { TableData } from './Table';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import {
  KeycloakUser,
  getKeycloakUsersArray,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '@opensrp/store';
import { getAccessToken } from '@onaio/session-reducer';

export interface Props {
  // data: data[];
  // tree: tree[];
  accessToken: string;
}

const LocationUnit: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [tableData, setTableData] = useState<TableData[] | null>(null);
  const [treeData, setTreeData] = useState<TreeData[] | null>(null);

  useEffect(() => {
    const serve = new OpenSRPService(
      props.accessToken,
      'https://opensrp-stage.smartregister.org/opensrp/rest/',
      'location/sync'
    );

    serve
      .list({ is_jurisdiction: true, serverVersion: 0 })
      .then((response: LocationUnitObj[]) => {
        fetchLocationUnitsCreator(response);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const tableData: TableData[] = [];

    for (let i = 1; i < 5; i++) {
      tableData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        level: i,
        lastupdated: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
        status: 'Active',
        type: 'Feautire',
        created: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
        externalid: `asdkjh123${i}`,
        openmrsid: `asdasdasdkjh123${i}`,
        username: `edward ${i}`,
        version: `${i}`,
        syncstatus: 'Synced',
      });
    }

    setTableData(tableData);
  }, []);

  useEffect(() => {
    const tree: TreeData[] = [
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

    setTreeData(tree);
  }, []);

  useEffect(() => {
    const serve = new OpenSRPService(
      props.accessToken,
      'https://opensrp-stage.smartregister.org/opensrp/rest/',
      'location/sync'
    );

    serve
      .create({ is_jurisdiction: true })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  }, []);

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          {treeData && <Tree data={treeData} />}
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
            {tableData && (
              <Form form={form} component={false}>
                <Table
                  data={tableData}
                  onViewDetails={(e: LocationDetailData) => setDetail(e)}
                  accessToken={props.accessToken}
                />
              </Form>
            )}
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
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = getAccessToken(state) as string;

  return {
    keycloakUsers,
    accessToken,
  };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

const ConnectedLocationUnit = connect(mapStateToProps, mapDispatchToProps)(LocationUnit);
export default ConnectedLocationUnit;
