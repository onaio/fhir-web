import React from 'react';
import { Helmet } from 'react-helmet';
import Form from './Form';

export const LocationUnitGroupAdd: React.FC = () => {
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
