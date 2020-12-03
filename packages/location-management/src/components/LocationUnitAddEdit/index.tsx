import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { Ripple } from '@onaio/loaders';
import { OpenSRPService } from '@opensrp/server-service';
import {
  LOCATION_UNIT_FINDBYPROPERTIES,
  LOCATION_HIERARCHY,
  LOCATION_TAG_ALL,
  API_BASE_URL,
} from '../../constants';
import { fetchLocationUnits, LocationUnit } from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField } from './Form';

import { Row, Col } from 'antd';
import { LocationTag } from '../../ducks/location-tags';
import reducerRegistry from '@onaio/redux-reducer-registry';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { generateJurisdictionTree } from '../LocationTree/utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/types';

import './LocationUnitAddEdit.css';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

const { getFilterParams } = OpenSRPService;

export const LocationUnitAddEdit: React.FC = () => {
  const params: { id: string } = useParams();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [locationtag, setLocationtag] = useState<LocationTag[]>([]);
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | undefined>(undefined);
  const Treedata = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (params.id) {
      const serve = new OpenSRPService(
        accessToken,
        API_BASE_URL,
        `location/${params.id}?is_jurisdiction=true`
      );
      serve
        .list()
        .then((response: LocationUnit) => {
          setLocationUnitDetail({
            name: response.properties.name,
            parentId: response.properties.parentId,
            status: response.properties.status,
            externalId: response.properties.externalId,
            locationTags: response.locationTags?.map((e) => e.id),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          });
        })
        .catch((e) => sendErrorNotification(`${e}`));
    }
  }, [accessToken, params.id]);

  useEffect(() => {
    if (!locationtag.length) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list()
        .then((response: LocationTag[]) => {
          setLocationtag(response);
        })
        .catch((e) => sendErrorNotification(`${e}`));
    }
  }, [accessToken, locationtag.length]);

  useEffect(() => {
    if (!Treedata.length) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_FINDBYPROPERTIES);
      serve
        .list({
          // eslint-disable-next-line @typescript-eslint/camelcase
          is_jurisdiction: true,
          // eslint-disable-next-line @typescript-eslint/camelcase
          return_geometry: false,
          // eslint-disable-next-line @typescript-eslint/camelcase
          properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
        })
        .then((response: LocationUnit[]) => {
          dispatch(fetchLocationUnits(response));
          const rootIds = response.map((rootLocObj) => rootLocObj.id);
          if (rootIds.length) {
            rootIds.forEach((id) => {
              const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_HIERARCHY);
              serve
                .read(id)
                .then((res: RawOpenSRPHierarchy) => {
                  const hierarchy = generateJurisdictionTree(res);
                  // if (hierarchy.model && hierarchy.model.children)
                  dispatch(fetchAllHierarchies(hierarchy.model));
                })
                .catch((e) => sendErrorNotification(`${e}`));
            });
          }
        })
        .catch((e) => sendErrorNotification(`${e}`));
    }
  }, [accessToken, Treedata.length, dispatch]);

  if (!locationtag.length || !Treedata.length || (params.id && !LocationUnitDetail))
    return <Ripple />;

  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? 'Edit' : 'Add'} Location Unit Group</title>
      </Helmet>

      <h5 className="mb-4">{params.id ? 'Edit' : 'Add'} Location Unit Group</h5>

      <Col className="bg-white p-4" span={24}>
        <Form
          treedata={Treedata}
          id={params.id}
          locationtag={locationtag}
          initialValue={LocationUnitDetail}
        />
      </Col>
    </Row>
  );
};

export default LocationUnitAddEdit;
