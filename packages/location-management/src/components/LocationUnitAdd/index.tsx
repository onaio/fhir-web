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
  LOCATION_UNIT_EXTRAFIELDS,
  LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER,
} from '../../constants';
import { fetchLocationUnits, LocationUnit } from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField } from './Form';

import { notification } from 'antd';
import { LocationTag } from '../../ducks/location-tags';
import reducerRegistry from '@onaio/redux-reducer-registry';
import locationHierarchyReducer, {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import {
  RawOpenSRPHierarchy,
  generateJurisdictionTree,
  getFilterParams,
  ParsedHierarchyNode,
} from '../LocationTree/utils';

import './LocationUnitAdd.css';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export interface ExtraFieldsSettings {
  key: string; // Used for key value in location properties in payload
  value?: string | number; // Used for default Value in input
  label?: string; // Label For input field
  description?: string; // Placeholder for input
  type: 'email' | 'number' | 'password' | 'text' | 'time' | 'url'; // type of the input
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  v1Settings: boolean;
  resolveSettings: boolean;
  documentId: string;
  serverVersion: number;
}

export const LocationUnitAdd: React.FC = () => {
  const params: { id: string } = useParams();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [locationtag, setLocationtag] = useState<LocationTag[] | null>(null);
  const [extrafields, setExtrafields] = useState<ExtraFieldsSettings[] | null>(null);
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | null>(null);
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
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  }, [accessToken, params.id]);

  useEffect(() => {
    if (!locationtag) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list()
        .then((response: LocationTag[]) => {
          setLocationtag(response);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  }, [accessToken, locationtag]);

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
                .catch((e) => notification.error({ message: `${e}`, description: '' }));
            });
          }
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  }, [accessToken, Treedata.length, dispatch]);

  useEffect(() => {
    if (!extrafields) {
      const serve = new OpenSRPService(
        accessToken,
        API_BASE_URL,
        LOCATION_UNIT_EXTRAFIELDS + `&identifier=${LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER}`
      );
      serve
        .list()
        .then((response: ExtraFieldsSettings[]) => {
          setExtrafields(response !== [] ? response : []);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  }, [accessToken, extrafields]);

  if (
    extrafields === null ||
    locationtag === null ||
    !Treedata.length ||
    (params.id && !LocationUnitDetail)
  )
    return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form
          extraFields={extrafields}
          treedata={Treedata}
          id={params.id}
          locationtag={locationtag}
          initialValue={LocationUnitDetail ? LocationUnitDetail : undefined}
        />
      </div>
    </section>
  );
};

export default LocationUnitAdd;
