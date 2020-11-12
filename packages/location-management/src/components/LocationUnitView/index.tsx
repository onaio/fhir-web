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
import locationUnitsReducer, {
  fetchLocationUnits,
  LocationUnit,
  reducerName as locationUnitsReducerName,
} from '../../ducks/location-units';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, LOCATION_UNIT_GET, URL_LOCATION_UNIT_ADD } from '../../constants';
import Table, { TableData } from './Table';
import './LocationUnitView.css';
import { Ripple } from '@onaio/loaders';
import Tree from '../LocationTree';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  getCurrentChildren,
  fetchAllHierarchies,
  fetchCurrentChildren,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import {
  generateJurisdictionTree,
  RawOpenSRPHierarchy,
  getFilterParams,
  TreeNode,
} from '../LocationTree/utils';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export interface Props {}

const defaultProps: Props = {};

const LocationUnitView: React.FC<Props> = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const Treedata = useSelector((state) => (getAllHierarchiesArray(state) as unknown) as TreeNode[]);
  const locationsArray = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as TreeNode[];
  const currentParentChildren = (useSelector((state) =>
    getCurrentChildren(state)
  ) as unknown) as TreeNode[];
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [rootIds, setRootIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<'Component' | 'Hierarchy' | 'Detail' | false>(
    'Component'
  );

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
          setIsLoading('Hierarchy');
          dispatch(fetchLocationUnits(response));
          setRootIds(response.map((rootLocObj: any) => rootLocObj.id));
        })
        .catch((e) => console.log(e));
    }
  });

  React.useEffect(() => {
    if (rootIds.length && isLoading === 'Hierarchy' && !Treedata.length) {
      rootIds.forEach((id: string) => {
        const serve = new OpenSRPService(accessToken, API_BASE_URL, '/location/hierarchy');
        serve
          .read(id)
          .then((res: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(res);
            if (hierarchy.model && hierarchy.model.children)
              dispatch(fetchAllHierarchies(hierarchy.model));
            setIsLoading(false);
          })
          .catch((e) => console.log(e));
      });
    }
  }, [rootIds, isLoading]);

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

  if (isLoading && isLoading != 'Detail') return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            OnItemClick={(item, [expandedKeys, setExpandedKeys]) => {
              if (item.children) {
                // build out parent row info from here
                const children = [item, ...item.children];
                dispatch(fetchCurrentChildren(children));
                const allExpandedKeys = [...new Set([...expandedKeys, item.title])];
                setExpandedKeys(allExpandedKeys);
              }
            }}
            data={Treedata}
          />
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

        {(isLoading === 'Detail' || detail) && (
          <Col className="pl-3" span={5}>
            {isLoading === 'Detail' ? (
              <Ripple />
            ) : (
              detail && <LocationUnitDetail onClose={() => setDetail(null)} {...detail} />
            )}
          </Col>
        )}
      </Row>
    </section>
  );
};

LocationUnitView.defaultProps = defaultProps;

export default LocationUnitView;
