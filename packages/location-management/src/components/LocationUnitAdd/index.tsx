import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { Ripple } from '@onaio/loaders';
import { OpenSRPService } from '@opensrp/server-service';
import {
  LOCATION_FINDBYPROPERTIES,
  LOCATION_HIERARCHY,
  LOCATION_TAG_ALL,
  API_BASE_URL,
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
  TreeNode,
} from '../LocationTree/utils';

reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

import './LocationUnitAdd.css';

export const LocationUnitAdd: React.FC = () => {
  const params: { id: string } = useParams();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [locationtag, setLocationtag] = useState<LocationTag[] | undefined>(undefined);
  const Treedata = useSelector((state) => (getAllHierarchiesArray(state) as unknown) as TreeNode[]);

  const dispatch = useDispatch();

  let LocationUnitDetail: FormField | undefined = undefined;
  let locationunitReady = locationtag?.length != 0 || false;
  let treeselectReady = Treedata.length != 0 || false;

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
          LocationUnitDetail = {
            name: response.properties.name,
            parentId: response.properties.parentId,
            status: response.properties.status,
            externalId: response.properties.externalId,
            locationTags: response.locationTags?.map((e) => e.id),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          };
          console.log('Location Unit Detail : ', response);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!locationtag) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list()
        .then((response: LocationTag[]) => {
          locationunitReady = true;
          setLocationtag(response);
          if (treeselectReady && locationunitReady) setIsLoading(false);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    } else {
      if (treeselectReady && locationunitReady) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!Treedata.length) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_FINDBYPROPERTIES);
      serve
        .list({
          is_jurisdiction: true,
          return_geometry: false,
          properties_filter: getFilterParams({ status: 'Active', geographicLevel: 0 }),
        })
        .then((response: any) => {
          dispatch(fetchLocationUnits(response));
          const rootIds = response.map((rootLocObj: any) => rootLocObj.id);
          if (rootIds.length) {
            rootIds.forEach((id: string) => {
              const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_HIERARCHY);
              serve
                .read(id)
                .then((res: RawOpenSRPHierarchy) => {
                  const hierarchy = generateJurisdictionTree(res);
                  if (hierarchy.model && hierarchy.model.children)
                    dispatch(fetchAllHierarchies(hierarchy.model));
                  treeselectReady = true;
                  if (treeselectReady && locationunitReady) setIsLoading(false);
                })
                .catch((e) => notification.error({ message: `${e}`, description: '' }));
            });
          } else {
            treeselectReady = true;
            if (treeselectReady && locationunitReady) setIsLoading(false);
          }
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    } else {
      if (treeselectReady && locationunitReady) setIsLoading(false);
    }
  }, []);

  if (IsLoading || !locationtag || !Treedata) return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form
          treedata={Treedata}
          id={params.id}
          locationtag={locationtag}
          initialValue={LocationUnitDetail}
        />
      </div>
    </section>
  );
};

export default LocationUnitAdd;
