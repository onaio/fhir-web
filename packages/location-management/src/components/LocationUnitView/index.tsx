/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail, { Props as LocationDetailData } from '../LocationDetail';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchLocationUnits,
  getLocationUnitsArray,
  LocationUnit,
  LocationUnitStatus,
  LocationUnitSyncStatus,
  reducerName,
} from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, LOCATION_UNIT_ALL, URL_ADD_LOCATIONS_UNIT } from '../../constants';
import Tree from './Tree';
import Table, { TableData } from './Table';
import './LocationUnitView.css';

reducerRegistry.register(reducerName, reducer);

const LocationUnitView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const locationsArray = useSelector((state) => getLocationUnitsArray(state));
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoading) {
      let serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_ALL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationUnit[]) => {
          dispatch(fetchLocationUnits(response));
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
  });

  const tableData: TableData[] = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationUnit, i: number) => {
      const date = (i + 1) % 28;
      tableData.push({
        key: i.toString(),
        created: new Date(`Thu Oct ${date} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
        lastupdated: new Date(`Thu Oct ${date} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
        parentId: location.properties.parentId ? location.properties.parentId : '-',
        externalId: location.properties.externalId ? location.properties.externalId : '-',
        OpenMRS_Id: location.properties.OpenMRS_Id ? location.properties.OpenMRS_Id : '-',
        status: location.properties.status
          ? location.properties.status
          : LocationUnitStatus.INACTIVE,
        syncstatus: location.syncStatus ? location.syncStatus : LocationUnitSyncStatus.NOTSYNCED,
        type: location.type ? location.type : '-',
        username: location.properties.username ? location.properties.username : '-',
        version: location.properties.version ? location.properties.version : 0,
        name: location.properties.name ? location.properties.name : '-',
        geographicLevel: location.properties.geographicLevel
          ? location.properties.geographicLevel
          : 0,
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
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Link to={window.location.pathname + URL_ADD_LOCATIONS_UNIT}>
                <Button type="primary">
                  <PlusOutlined />
                  Add location unit
                </Button>
              </Link>
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
              accessToken={accessToken}
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

export default LocationUnitView;
