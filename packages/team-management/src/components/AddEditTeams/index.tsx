import React from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/organizations';
import { useParams } from 'react-router';

reducerRegistry.register(reducerName, reducer);

export const TeamsAddEdit: React.FC = () => {
  const params: { id: string } = useParams();
  const { id } = params;
  return (
    <section>
      <Helmet>
        <title>{params.id ? 'Edit' : 'Add'} Teams</title>
      </Helmet>

      <h5 className="mb-3">{params.id ? 'Edit' : 'Add'} Teams</h5>

      <div className="bg-white p-5"></div>
    </section>
  );
};

export default TeamsAddEdit;
