import React from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';

reducerRegistry.register(reducerName, reducer);

export const LocationUnitAdd: React.FC = () => {
  const params: { id: string } = useParams();
  const { id } = params;
  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form id={id} />
      </div>
    </section>
  );
};

export default LocationUnitAdd;
