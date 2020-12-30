import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';
import { ADD_LOCATION_UNIT_GROUP, EDIT_LOCATION_UNIT_GROUP } from '../../constants';
import { Props } from '../../ducks/types';

reducerRegistry.register(reducerName, reducer);

export const LocationUnitGroupAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const { opensrpBaseURL } = props;
  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? EDIT_LOCATION_UNIT_GROUP : ADD_LOCATION_UNIT_GROUP}</title>
      </Helmet>

      <h5 className="mb-4">{params.id ? EDIT_LOCATION_UNIT_GROUP : ADD_LOCATION_UNIT_GROUP}</h5>

      <Col className="bg-white p-4" span={24}>
        <Form opensrpBaseURL={opensrpBaseURL} id={params.id} />
      </Col>
    </Row>
  );
};

export default LocationUnitGroupAddEdit;
