import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'antd';
import './Home.css';
import { useTranslation } from 'react-i18next';

const Home: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row className="welcome-box">
        <Col span={12} offset={6}>
          <h3>{t('Welcome to OpenSRP')}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
