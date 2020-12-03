/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider, Input } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationTagDetail, { LocationTagDetailProps } from '../LocationTagDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchLocationTags,
  getLocationTagsArray,
  LocationTag,
  reducerName,
} from '../../ducks/location-tags';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, LOCATION_TAG_ALL, URL_LOCATION_TAG_ADD } from '../../constants';
import Table, { TableData } from './Table';
import './LocationTagView.css';
import { Ripple } from '@onaio/loaders';
import { Link } from 'react-router-dom';
import { sendErrorNotification } from '@opensrp/notifications';

reducerRegistry.register(reducerName, reducer);

const LocationTagView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const locationsArray = useSelector((state) => getLocationTagsArray(state));
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<LocationTagDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationTag[]) => {
          dispatch(fetchLocationTags(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  });

  const tableData: TableData[] = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationTag, i: number) => {
      tableData.push({
        key: i.toString(),
        id: location.id,
        name: location.name,
        active: location.active,
        description: location.description,
      });
    });
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as TableData[]);
  };

  if (isLoading) return <Ripple />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>Locations Tag</title>
      </Helmet>
      <h5 className="mb-3">Location Tag Management</h5>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between p-3">
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
              <Link to={URL_LOCATION_TAG_ADD}>
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
          <div className="bg-white p-3">
            <Table
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={(e: LocationTagDetailProps) => setDetail(e)}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <LocationTagDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};

export default LocationTagView;
