/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationUnitDetail, { Props as LocationDetailData } from '../LocationUnitDetail';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { fetchLocationUnits, LocationUnit, reducerName } from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, LOCATION_UNIT_GET, URL_LOCATION_UNIT_ADD } from '../../constants';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import { Ripple } from '@onaio/loaders';
import ConnectedTree from '../LocationTree';
import { getAllHierarchiesArray, getCurrentChildren } from '../../ducks/location-hierarchy';
import { getFilterParams, TreeNode } from '../LocationTree/utils';

reducerRegistry.register(reducerName, reducer);

export interface Props {}

const defaultProps: Props = {};

const LocationUnitView: React.FC<Props> = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const locationsArray = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as TreeNode[];
  const currentParentChildren = (useSelector((state) =>
    getCurrentChildren(state)
  ) as unknown) as TreeNode[];
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [rootIds, setRootIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<'Component' | 'Detail' | false>('Component');

  function loadSingleLocation(row: TableData) {
    setIsLoading('Detail');
    const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_GET);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    serve
      .read(row.id, { is_jurisdiction: true })
      .then((res: LocationUnit) => {
        setDetail(res);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    const params = {
      is_jurisdiction: true,
      return_geometry: false,
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    };

    if (isLoading === 'Component') {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, '/location/findByProperties');
      serve
        .list(params)
        .then((response: any) => {
          setIsLoading(false);
          dispatch(fetchLocationUnits(response));
          setRootIds(response.map((rootLocObj: any) => rootLocObj.id));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });

  const tableData: any = [];

  if (currentParentChildren && currentParentChildren.length) {
    currentParentChildren.forEach((child: TreeNode, i: number) => {
      tableData.push({
        id: child.id,
        key: i.toString(),
        name: child.label,
        geographicLevel: child.node.attributes.geographicLevel,
      });
    });
  } else if (locationsArray && locationsArray.length && !currentParentChildren.length) {
    locationsArray.forEach((location: any, i: number) => {
      tableData.push({
        id: location.id,
        key: i.toString(),
        name: location.label,
        geographicLevel: location.node.attributes.geographicLevel,
      });
    });
  }

  if (isLoading === 'Component') return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <ConnectedTree rootIds={rootIds} data={[]} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Link to={URL_LOCATION_UNIT_ADD}>
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
            <Table data={tableData} onViewDetails={loadSingleLocation} />
          </div>
        </Col>

        {isLoading === 'Detail' && (
          <Col className="pl-3" span={5}>
            <Ripple />
          </Col>
        )}

        {detail && (
          <Col className="pl-3" span={5}>
            <LocationUnitDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        )}
      </Row>
    </section>
  );
};

LocationUnitView.defaultProps = defaultProps;

export default LocationUnitView;
