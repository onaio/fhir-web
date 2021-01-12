import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import {
  LOCATION_UNIT_GROUP_ALL,
  ADD_LOCATION_UNIT,
  EDIT_LOCATION_UNIT,
  LOCATION_UNIT_EXTRAFIELDS,
  LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER,
} from '../../constants';
import { ExtraField, fetchLocationUnits, LocationUnit } from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField } from './Form';

import { Row, Col, Spin } from 'antd';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { generateJurisdictionTree, getBaseTreeNode, getHierarchy } from '../LocationTree/utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { ParsedHierarchyNode, Props } from '../../ducks/types';

import './LocationUnitAddEdit.css';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export const LocationUnitAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [locationUnitGroup, setLocationUnitGroup] = useState<LocationUnitGroup[]>([]);
  const [extrafields, setExtrafields] = useState<ExtraField[] | null>(null);
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | undefined>(undefined);
  const Treedata = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );
  const { opensrpBaseURL } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (params.id) {
      const serve = new OpenSRPService(
        accessToken,
        opensrpBaseURL,
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
            locationTags: response.locationTags?.map((loc) => loc.id),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          });
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [accessToken, params.id, opensrpBaseURL]);

  useEffect(() => {
    if (!locationUnitGroup.length) {
      const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_GROUP_ALL);
      serve
        .list()
        .then((response: LocationUnitGroup[]) => {
          setLocationUnitGroup(response);
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [accessToken, locationUnitGroup.length, opensrpBaseURL]);

  useEffect(() => {
    if (!Treedata.length) {
      getBaseTreeNode(accessToken, opensrpBaseURL)
        .then((response) => {
          dispatch(fetchLocationUnits(response));
          getHierarchy(response, accessToken, opensrpBaseURL)
            .then((hierarchy) => {
              hierarchy.forEach((hier) => {
                const processed = generateJurisdictionTree(hier);
                dispatch(fetchAllHierarchies(processed.model));
              });
            })
            .catch(() => sendErrorNotification('An error occurred'));
        })
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [Treedata, accessToken, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (!extrafields) {
      const serve = new OpenSRPService(
        accessToken,
        opensrpBaseURL,
        LOCATION_UNIT_EXTRAFIELDS + `&identifier=${LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER}`
      );
      serve
        .list()
        .then((response: ExtraField[]) => setExtrafields(response))
        .catch(() => sendErrorNotification('An error occurred'));
    }
  }, [accessToken, extrafields, opensrpBaseURL]);

  if (
    extrafields === null ||
    !locationUnitGroup.length ||
    !Treedata.length ||
    (params.id && !LocationUnitDetail)
  )
    return (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
        size={'large'}
      />
    );

  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? EDIT_LOCATION_UNIT : ADD_LOCATION_UNIT}</title>
      </Helmet>

      <h5 className="mb-4 header-title">
        {params.id ? `${EDIT_LOCATION_UNIT} | ${LocationUnitDetail?.name}` : ADD_LOCATION_UNIT}
      </h5>

      <Col className="bg-white p-4" span={24}>
        <Form
          extraFields={extrafields}
          opensrpBaseURL={opensrpBaseURL}
          treedata={Treedata}
          id={params.id}
          locationUnitGroup={locationUnitGroup}
          initialValue={LocationUnitDetail}
        />
      </Col>
    </Row>
  );
};

export default LocationUnitAddEdit;
