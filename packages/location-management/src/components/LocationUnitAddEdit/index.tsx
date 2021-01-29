import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  LOCATION_HIERARCHY,
  LOCATION_UNIT_GROUP_ALL,
  ADD_LOCATION_UNIT,
  EDIT_LOCATION_UNIT,
  LOCATION_UNIT_EXTRAFIELDS,
  LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER,
  ERROR_OCCURED,
  baseURL,
} from '../../constants';
import { ExtraField, fetchLocationUnits, LocationUnit } from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import { LocationForm, FormFields, LocationFormProps } from './Form';
import { Row, Col, Spin } from 'antd';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { sendErrorNotification } from '@opensrp/notifications';
import './LocationUnitAddEdit.css';
import { RawOpenSRPHierarchy, ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { generateJurisdictionTree } from '../../ducks/locationHierarchy/utils';
import { loadJurisdictions } from '../../helpers/dataLoaders';
import { FormInstances, getLocationFormFields } from './utils';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

/** props for the locationUnitAddEdit form HOC */
export interface LocationUnitAddEditProps extends Pick<LocationFormProps, 'hiddenFields'> {
  openSRPBaseURL: string;
  instance: FormInstances;
}

const defaultProps = {
  openSRPBaseURL: baseURL,
  instance: FormInstances.CORE,
  hiddenFields: [],
};

/** Gets the hierarchy of the location units
 *
 * @param {Array<LocationUnit>} location - array of location units to get hierarchy of
 * @param {string} openSRPBaseURL - base url
 * @returns {Promise<Array<RawOpenSRPHierarchy>>} array of RawOpenSRPHierarchy
 */
export async function getHierarchy(location: LocationUnit[], openSRPBaseURL: string) {
  const hierarchy: RawOpenSRPHierarchy[] = [];

  for await (const loc of location) {
    const serve = new OpenSRPService(LOCATION_HIERARCHY, openSRPBaseURL);
    const data = await serve.read(loc.id).then((response: RawOpenSRPHierarchy) => response);
    hierarchy.push(data);
  }

  return hierarchy;
}

/** HOC component that wraps and renders the Location Form
 *
 * @param props - the props
 */
const LocationUnitAddEdit = (props: LocationUnitAddEditProps) => {
  const params: { id: string } = useParams();
  const { openSRPBaseURL, instance } = props;
  const [locationUnitGroup, setLocationUnitGroup] = useState<LocationUnitGroup[]>([]);
  const [extraFields, setExtraFields] = useState<ExtraField[] | null>(null);
  const treeData = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const parentId = query.get('parentId') ?? undefined;
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormFields | undefined>({
    ...getLocationFormFields(undefined, instance),
    parentId,
  });

  useEffect(() => {
    if (params.id) {
      const serve = new OpenSRPService(
        `location/${params.id}?is_jurisdiction=true`,
        openSRPBaseURL
      );
      serve
        .list()
        .then((response: LocationUnit) => {
          setLocationUnitDetail({
            ...getLocationFormFields(response, instance),
            parentId,
          });
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [params.id, openSRPBaseURL, instance, parentId]);

  useEffect(() => {
    if (!locationUnitGroup.length) {
      const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, openSRPBaseURL);
      serve
        .list()
        .then((response: LocationUnitGroup[]) => {
          setLocationUnitGroup(response);
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnitGroup.length, openSRPBaseURL]);

  useEffect(() => {
    if (!treeData.length) {
      loadJurisdictions(undefined, openSRPBaseURL)
        .then((response) => {
          if (response) {
            dispatch(fetchLocationUnits(response));
            return getHierarchy(response, openSRPBaseURL)
              .then((hierarchy) => {
                hierarchy.forEach((hier) => {
                  const processed = generateJurisdictionTree(hier);
                  dispatch(fetchAllHierarchies(processed.model));
                });
              })
              .catch((err) => Promise.reject(err));
          }
        })
        .catch((_) => {
          sendErrorNotification(ERROR_OCCURED);
        });
    }
  }, [treeData, dispatch, openSRPBaseURL]);

  useEffect(() => {
    if (!extraFields) {
      const serve = new OpenSRPService(
        LOCATION_UNIT_EXTRAFIELDS + `&identifier=${LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER}`,
        openSRPBaseURL
      );
      serve
        .list()
        .then((response: ExtraField[]) => {
          setExtraFields(response);
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [extraFields, openSRPBaseURL]);

  if (
    extraFields === null ||
    !locationUnitGroup.length ||
    !treeData.length ||
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
        <LocationForm
          extraFields={extraFields}
          openSRPBaseURL={openSRPBaseURL}
          treeData={treeData}
          locationUnitGroup={locationUnitGroup}
          initialValues={LocationUnitDetail}
          hiddenFields={props.hiddenFields}
        />
      </Col>
    </Row>
  );
};

LocationUnitAddEdit.defaultProps = defaultProps;

export { LocationUnitAddEdit };
