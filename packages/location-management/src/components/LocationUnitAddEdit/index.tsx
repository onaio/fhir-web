import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import {
  LOCATION_UNIT_FINDBYPROPERTIES,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_GROUP_ALL,
  ADD_LOCATION_UNIT,
  EDIT_LOCATION_UNIT,
  LOCATION_UNIT_EXTRAFIELDS,
  LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER,
  ERROR_OCCURED,
} from '../../constants';
import {
  ExtraField,
  fetchLocationUnits,
  LocationUnit,
  LocationUnitStatus,
} from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField } from './Form';

import { Row, Col, Spin } from 'antd';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
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

export interface Props {
  opensrpBaseURL: string;
}

/** Gets all the location unit at geographicLevel 0
 *
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(accessToken: string, opensrpBaseURL: string) {
  const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_FINDBYPROPERTIES);
  return await serve
    .list({
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      return_geometry: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
    })
    .then((response: LocationUnit[]) => response);
}

/** Gets the hierarchy of the location units
 *
 * @param {Array<LocationUnit>} location - array of location units to get hierarchy of
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(
  location: LocationUnit[],
  accessToken: string,
  opensrpBaseURL: string
) {
  const hierarchy: RawOpenSRPHierarchy[] = [];

  for await (const loc of location) {
    const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_HIERARCHY);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}

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
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const parentId = query.get('parentId');

  useEffect(() => {
    if (parentId != null)
      setLocationUnitDetail({
        name: '',
        status: LocationUnitStatus.ACTIVE,
        type: '',
        parentId: parentId,
      });
  }, [parentId]);

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
        .catch(() => sendErrorNotification(ERROR_OCCURED));
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
        .catch(() => sendErrorNotification(ERROR_OCCURED));
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
            .catch(() => sendErrorNotification(ERROR_OCCURED));
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
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
        .catch(() => sendErrorNotification(ERROR_OCCURED));
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
