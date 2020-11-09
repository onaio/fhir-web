/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Row, Col, Menu, Dropdown, Button, Divider } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail, { Props as LocationDetailData } from '../LocationDetail';
import ConnectedTree, { TreeData } from '../LocationTree';
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

import { getAccessToken } from '@onaio/session-reducer';
import { getFilterParams, TreeNode } from '../LocationTree/utils';
import { getCurrentChildren } from '../../ducks/location-hierarchy';

reducerRegistry.register(reducerName, reducer);

export interface Props {
  accessToken: string;
  currentParentChildren: any;
  fetchLocationUnitsCreator: typeof fetchLocationUnits;
  locationsArray: LocationUnitObj[];
  serviceClass: typeof OpenSRPService;
}

const defaultProps: Props = {
  accessToken: '',
  currentParentChildren: [],
  fetchLocationUnitsCreator: fetchLocationUnits,
  locationsArray: [],
  serviceClass: OpenSRPService,
};

const LocationUnit: React.FC<Props> = (props: Props) => {
  const { fetchLocationUnitsCreator, serviceClass, currentParentChildren } = props;
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<LocationDetailData | null>(null);
  const [rootIds, setRootIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const params = {
      is_jurisdiction: true,
      return_geometry: false,
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    };
    if (isLoading) {
      const serve = new serviceClass(
        props.accessToken,
        'https://opensrp-stage.smartregister.org/opensrp/rest',
        '/location/findByProperties'
      );
      serve
        .list(params)
        .then((response: any) => {
          setIsLoading(false);
          fetchLocationUnitsCreator(response);
          setRootIds(response.map((rootLocObj: any) => rootLocObj.id));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });

  const tableData: any = [];

  console.log('current chuodren????', currentParentChildren);

  if (currentParentChildren.length) {
    currentParentChildren.forEach((child: TreeNode, i: number) => {
      tableData.push({
        key: i.toString(),
        name: child.label,
        level: child.node.attributes.geographicLevel,
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
            <ConnectedTree
              accessToken={props.accessToken}
              serviceClass={OpenSRPService}
              rootIds={rootIds}
              data={[]}
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
  currentParentChildren: any;
  locationsArray: LocationUnitObj[];
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const accessToken = getAccessToken(state) as string;
  const locationsArray = getLocationUnitsArray(state);
  const currentParentChildren = getCurrentChildren(state);
  return { accessToken, locationsArray, currentParentChildren };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchLocationUnitsCreator: fetchLocationUnits,
};

const ConnectedLocationUnit = connect(mapStateToProps, mapDispatchToProps)(LocationUnit);
export default ConnectedLocationUnit;
