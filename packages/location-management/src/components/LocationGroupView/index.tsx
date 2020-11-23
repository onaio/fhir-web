/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider, Input, notification } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationGroupDetail, { LocationGroupDetailProps } from '../LocationGroupDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchLocationGroups,
  getLocationGroupsArray,
  LocationGroup,
  reducerName,
} from '../../ducks/location-groups';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, LOCATION_GROUP_ALL, URL_LOCATION_GROUP_ADD } from '../../constants';
import Table, { TableData } from './Table';
import './LocationGroupView.css';
import { Ripple } from '@onaio/loaders';
import { Link } from 'react-router-dom';

reducerRegistry.register(reducerName, reducer);

const LocationGroupView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const locationsArray = useSelector((state) => getLocationGroupsArray(state));
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<LocationGroupDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_GROUP_ALL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationGroup[]) => {
          dispatch(fetchLocationGroups(response));
          setIsLoading(false);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  });

  const tableData: TableData[] = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationGroup, i: number) => {
      tableData.push({
        key: i.toString(),
        id: location.id,
        name: location.name,
        active: location.active,
        description: location.description,
      });
    });
  }

  const onChange = (e: { target: { value: string } }) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as TableData[]);
  };

  if (isLoading) return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Locations Group</title>
      </Helmet>
      <h5 className="mb-3">Location Group Management</h5>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder="Search"
                size="large"
                value={value}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </h5>
            <div>
              <Link to={URL_LOCATION_GROUP_ADD}>
                <Button type="primary">
                  <PlusOutlined />
                  Add location unit group
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
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={(e: LocationGroupDetailProps) => setDetail(e)}
            />
          </div>
        </Col>
        {detail && (
          <Col className="pl-3" span={5}>
            <LocationGroupDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        )}
      </Row>
    </section>
  );
};

export default LocationGroupView;
