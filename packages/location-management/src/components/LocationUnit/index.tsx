/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail, { Props as LocationDetailData } from '../LocationDetail';
import Tree, { TreeData } from './Tree';
import Table, { TableData } from './Table';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { OpenSRPService } from '@opensrp/server-service';
import reducer, {
  fetchLocationUnits,
  getLocationUnitsArray,
  LocationUnit as LocationUnitObj,
  reducerName,
} from '../../ducks/location-units';

reducerRegistry.register(reducerName, reducer);

import { getAccessToken } from '@onaio/session-reducer';

export interface Props {
  accessToken: string;
  fetchLocationUnitsCreator: typeof fetchLocationUnits;
  locationsArray: LocationUnitObj[];
  serviceClass: typeof OpenSRPService;
}

const defaultProps: Props = {
  accessToken: '',
  fetchLocationUnitsCreator: fetchLocationUnits,
  locationsArray: [],
  serviceClass: OpenSRPService,
};

const LocationUnit: React.FC<Props> = (props: Props) => {
  const { fetchLocationUnitsCreator, locationsArray, serviceClass } = props;
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [tableData, setTableData] = useState<TableData[] | null>(null);
  const [treeData, setTreeData] = useState<TreeData[] | null>(null);

  useEffect(() => {
    if (isLoading) {
      const serve = new serviceClass(
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
    }
  });

  console.log('data from store>>', props);

  const tableData: any = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationUnitObj, i: number) => {
      tableData.push({
        key: i.toString(),
        name: location.properties.name,
        level: location.properties.geographicLevel,
        lastupdated: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
      });
    });
  }

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          {
            <Tree
              data={[
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
              ]}
            />
          }
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
            <Table
              data={tableData}
              onViewDetails={(e: LocationDetailData) => setDetail(e)}
              accessToken={props.accessToken}
            />
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

LocationUnit.defaultProps = defaultProps;

export { LocationUnit };

/** Interface for connected state to props */
interface DispatchedProps {
  accessToken: string;
  locationsArray: LocationUnitObj[];
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const accessToken = getAccessToken(state) as string;
  const locationsArray = getLocationUnitsArray(state);
  return { accessToken, locationsArray };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchLocationUnitsCreator: fetchLocationUnits,
};

const ConnectedLocationUnit = connect(mapStateToProps, mapDispatchToProps)(LocationUnit);
export default ConnectedLocationUnit;
