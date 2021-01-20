import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router';
import { OpenSRPService } from '@opensrp/react-utils';
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
  getLocationUnitsArray,
  LocationUnit,
  LocationUnitStatus,
} from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField } from './Form';
import { Row, Col, Spin } from 'antd';
import {
  fetchLocationUnitGroups,
  getLocationUnitGroupsArray,
  LocationUnitGroup,
} from '../../ducks/location-unit-groups';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { sendErrorNotification } from '@opensrp/notifications';
import './LocationUnitAddEdit.css';
import { RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';
import { generateJurisdictionTree } from '../../ducks/locationHierarchy/utils';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

const { getFilterParams } = OpenSRPService;

export interface Props {
  opensrpBaseURL: string;
}

/** Gets all the location unit at geographicLevel 0
 *
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<LocationUnit>>} returns array of location unit at geographicLevel 0
 */
export async function getBaseTreeNode(opensrpBaseURL: string) {
  const serve = new OpenSRPService(LOCATION_UNIT_FINDBYPROPERTIES, opensrpBaseURL);
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
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(location: LocationUnit[], opensrpBaseURL: string) {
  const hierarchy: RawOpenSRPHierarchy[] = [];

  for await (const loc of location) {
    const serve = new OpenSRPService(LOCATION_HIERARCHY, opensrpBaseURL);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}

export const LocationUnitAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const locationUnits = useSelector((state) => getLocationUnitsArray(state));
  const locationUnitGroup = useSelector((state) => getLocationUnitGroupsArray(state));
  const Treedata = useSelector((state) => getAllHierarchiesArray(state));
  const [extrafields, setExtrafields] = useState<ExtraField[] | null>(null);
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | undefined>(undefined);
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
        `location/${params.id}?is_jurisdiction=true`,
        opensrpBaseURL
      );
      serve
        .list()
        .then((response: LocationUnit) => {
          setLocationUnitDetail({
            ...response.properties,
            locationTags: response.locationTags?.map((loc) => loc.id),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          });
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [params.id, opensrpBaseURL]);

  useEffect(() => {
    if (!locationUnitGroup.length) {
      const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, opensrpBaseURL);
      serve
        .list()
        .then((response: LocationUnitGroup[]) => fetchLocationUnitGroups(response))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnitGroup.length, opensrpBaseURL]);

  useEffect(() => {
    if (!locationUnits.length) {
      console.log('fetching locationUnits', locationUnits);
      getBaseTreeNode(opensrpBaseURL)
        .then((response) => dispatch(fetchLocationUnits(response)))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnits.length, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (!Treedata.length && locationUnits.length) {
      console.log('fetching tree', locationUnits);
      getHierarchy(locationUnits, opensrpBaseURL)
        .then((hierarchy) => {
          const allhierarchy = hierarchy.map((hier) => generateJurisdictionTree(hier).model);
          dispatch(fetchAllHierarchies(allhierarchy));
          console.log('allhierarchy:', allhierarchy);
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnits, Treedata.length, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (!extrafields) {
      const serve = new OpenSRPService(
        LOCATION_UNIT_EXTRAFIELDS + `&identifier=${LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER}`,
        opensrpBaseURL
      );
      serve
        .list()
        .then((response: ExtraField[]) => setExtrafields(response))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [extrafields, opensrpBaseURL]);

  if (
    extrafields === null ||
    !locationUnitGroup.length ||
    !Treedata.length ||
    (params.id && !LocationUnitDetail?.name)
  )
    return <Spin size={'large'} />;

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
