import React from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/location-units';
import Form from './Form';

reducerRegistry.register(reducerName, reducer);

export const LocationTagAdd: React.FC = () => {
  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form />
      </div>
    </section>
  );
};

export default LocationTagAdd;
