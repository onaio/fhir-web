/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin, Table } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Tree, locationHierachyDucks, ParsedHierarchyNode } from '@opensrp/location-management';
import { sendErrorNotification } from '@opensrp/notifications';
import { reducer, reducerName, getCurrentLocationSettings, Setting } from '../../ducks/settings';
import { columns } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, getLocationHierarchy } from '../../helpers/dataLoaders';
import { POP_CHARACTERISTICS_PARAM } from '../../constants';

reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);
reducerRegistry.register(reducerName, reducer);

const getLocationSettings = getCurrentLocationSettings();

const { getAllHierarchiesArray } = locationHierachyDucks;

export interface AntTreeProps {
  title: JSX.Element;
  key: string;
  children: AntTreeProps[];
}

export interface Props {
  baseURL: string;
  restBaseURL: string;
  v2BaseURL: string;
}

export const LocationSettingsView: React.FC<Props> = (props: Props) => {
  const { baseURL, v2BaseURL } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLocId, setCurrentLocId] = useState<string>('');
  const locationSettings = useSelector((state) =>
    getLocationSettings(state, { locationId: currentLocId })
  );
  const treeData = (useSelector((state) =>
    getAllHierarchiesArray(state)
  ) as unknown) as ParsedHierarchyNode[];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getLocationHierarchy(baseURL, dispatch)
      .then((location: string) => setCurrentLocId(location))
      .catch((e: Error) => sendErrorNotification(`${e}`))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentLocId) {
      const params = {
        identifier: POP_CHARACTERISTICS_PARAM,
        locationId: currentLocId,
        resolve: true,
        serverVersion: 0,
      };
      fetchSettings(v2BaseURL, currentLocId, params, dispatch)
        .catch((e: Error) => sendErrorNotification(`${e}`))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocId]);

  if (loading) {
    return <Spin size="large" />;
  }

  const dataSource = (locationSettings as Setting[]).map((settingObject: Setting) => {
    const value =
      typeof settingObject.value === 'string'
        ? settingObject.value === 'true'
        : settingObject.value;
    const inheritedFrom = settingObject.inheritedFrom?.trim() ?? '_';
    const settingWithKey = {
      ...settingObject,
      key: settingObject.settingMetadataId,
      inheritedFrom,
      value: value ? 'Yes' : 'No',
    };
    return settingWithKey;
  });

  return (
    <section className="layout-content">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h5 className="mb-3">{'Settings'}</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentLocId(node.id)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <div className="bg-white p-3">
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default LocationSettingsView;
