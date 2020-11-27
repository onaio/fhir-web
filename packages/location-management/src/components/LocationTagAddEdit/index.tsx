import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';

reducerRegistry.register(reducerName, reducer);

export const LocationTagAddEdit: React.FC = () => {
  const params: { id: string } = useParams();
  const { id } = params;
  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? 'Edit' : 'Add'} Location Unit Group</title>
      </Helmet>

      <h5 className="mb-4">{params.id ? 'Edit' : 'Add'} Location Unit Group</h5>

      <Col className="bg-white p-4" span={24}>
        <Form id={id} />
      </Col>
    </Row>
  );
};

export default LocationTagAddEdit;
