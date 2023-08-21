import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { locationUnitsReducer, locationUnitsReducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';
import { useTranslation } from '../../mls';
import { Props } from '../../helpers/common';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

export const LocationUnitGroupAddEdit: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState('');
  const params: { id: string } = useParams();
  const { t } = useTranslation();
  const { opensrpBaseURL } = props;

  return (
    <Row className="content-section">
      <Helmet>
        <title>{params.id ? t('Edit Location Unit Group') : t('Add Location Unit Group')}</title>
      </Helmet>
      <PageHeader
        title={
          params.id
            ? t('Edit Location Unit Group | {{title}}', { title })
            : t('Add Location Unit Group')
        }
      />

      <Col className="bg-white p-4" span={24}>
        <Form setEditTitle={setTitle} opensrpBaseURL={opensrpBaseURL} id={params.id} />
      </Col>
    </Row>
  );
};

export default LocationUnitGroupAddEdit;
