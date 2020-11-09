/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail, { LocationDetailProps } from '../LocationDetail';
import { Link } from 'react-router-dom';
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
import { API_BASE_URL, LOCATION_TAG_ALL } from '../../constants';
import Table, { TableData } from './Table';
import './LocationTagView.css';
import { Ripple } from '@onaio/loaders';

reducerRegistry.register(reducerName, reducer);

const LocationTagView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const locationsArray = useSelector((state) => getLocationTagsArray(state));
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<LocationDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoading) {
      let serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationTag[]) => {
          dispatch(fetchLocationTags(response));
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
  });

  const tableData: TableData[] = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationTag, i: number) => {
      const date = (i + 1) % 28;
      tableData.push({
        key: i.toString(),
        id: location.id,
        name: location.name,
        active: location.active,
        description: location.description,
      });
    });
  }
  if (isLoading) return <Ripple />;
  return (
    <section>
      <Helmet>
        <title>Locations Tag</title>
      </Helmet>
      <h5 className="mb-3">Location Tag Management</h5>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Link to={window.location.pathname + LOCATION_TAG_ALL}>
                <Button type="primary">
                  <PlusOutlined />
                  Add location tag
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
            <Table data={tableData} onViewDetails={(e: LocationDetailProps) => setDetail(e)} />
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

export default LocationTagView;
