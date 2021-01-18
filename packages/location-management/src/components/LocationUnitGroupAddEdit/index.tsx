import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { locationUnitsReducer, locationUnitsReducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';
import { ADD_LOCATION_UNIT_GROUP, EDIT_LOCATION_UNIT_GROUP } from '../../constants';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

export interface Props {
  opensrpBaseURL: string;
}

export const LocationUnitGroupAddEdit: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState('');
  const params: { id: string } = useParams();
  const { opensrpBaseURL } = props;

  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? EDIT_LOCATION_UNIT_GROUP : ADD_LOCATION_UNIT_GROUP}</title>
      </Helmet>

      <h5 className="mb-4 header-title">
        {params.id ? `${EDIT_LOCATION_UNIT_GROUP} | ${title}` : ADD_LOCATION_UNIT_GROUP}
      </h5>

      <Col className="bg-white p-4" span={24}>
        <Form setEditTitle={setTitle} opensrpBaseURL={opensrpBaseURL} id={params.id} />
      </Col>
    </Row>
  );
};

export default LocationUnitGroupAddEdit;
