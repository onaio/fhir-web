/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin, Table } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  Tree,
  locationHierachyDucks,
  generateJurisdictionTree,
} from '@opensrp/location-management';
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { Setting } from '../../ducks/settings';
import { columns } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { POP_CHARACTERISTICS_PARAM, SECURITY_AUTHENTICATE_ENDPOINT } from '../../constants';
import { useQuery } from 'react-query';

reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);

const { getAllHierarchiesArray } = locationHierachyDucks;

export interface Props {
  baseURL: string;
  restBaseURL: string;
  v2BaseURL: string;
}

export const LocationSettingsView: React.FC<Props> = (props: Props) => {
  const { baseURL, v2BaseURL } = props;
  const dispatch = useDispatch();
  const [currentLocId, setCurrentLocId] = useState<string>('');

  const treeData = useSelector((state) => getAllHierarchiesArray(state));

  const userLocSettings = useQuery(
    SECURITY_AUTHENTICATE_ENDPOINT,
    () => new OpenSRPService(SECURITY_AUTHENTICATE_ENDPOINT, baseURL).list(),
    {
      onError: () => sendErrorNotification('ERROR OCCURRED'),
      select: (res) => res,
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userLocSettings.data?.locations) {
      const { locationsHierarchy } = userLocSettings.data.locations;
      const processedHierarchy = generateJurisdictionTree({ locationsHierarchy });
      dispatch(locationHierachyDucks.fetchAllHierarchies([processedHierarchy.model]));
      const { map: userLocMap } = userLocSettings.data.locations.locationsHierarchy;
      setCurrentLocId(Object.keys(userLocMap)[0]);
    }
  }, [userLocSettings.data, dispatch]);

  const locationSettings = useQuery(
    ['settings', currentLocId],
    () =>
      new OpenSRPService('settings', v2BaseURL).list({
        identifier: POP_CHARACTERISTICS_PARAM,
        locationId: currentLocId,
        resolve: true,
        serverVersion: 0,
      }),
    {
      onError: () => sendErrorNotification('ERROR OCCURRED'),
      select: (res: Setting[]) => res,
    }
  );

  if (!locationSettings.data?.length) return <Spin size="large" />;

  const dataSource = locationSettings.data.map((settingObject) => {
    return {
      ...settingObject,
      key: settingObject.settingMetadataId,
      inheritedFrom: settingObject.inheritedFrom?.trim() ?? '',
    };
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
