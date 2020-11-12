import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { Ripple } from '@onaio/loaders';
import { OpenSRPService } from '@opensrp/server-service';
import { API_BASE_URL } from '../../constants';
import { LocationUnit } from '../../ducks/location-units';
import { useSelector } from 'react-redux';
import Form, { FormField } from './Form';

import './LocationUnitAdd.css';

export const LocationUnitAdd: React.FC = () => {
  const params: { id: string } = useParams();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [IsLoading, setIsLoading] = useState<'component' | false>('component');
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      let serve = new OpenSRPService(
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
            locationTags: response.locationTags?.map((e) =>
              JSON.stringify({ id: e.id, name: e.name })
            ),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          });
          console.log('Location Unit Detail : ', response);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  if (IsLoading) return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form id={params.id} initialValue={LocationUnitDetail} />
      </div>
    </section>
  );
};

export default LocationUnitAdd;
