import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'antd';
import './Home.css';

const Home = (): JSX.Element => {
  return (
    <div className="text-center">
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row className="welcome-box">
        <Col span={12} offset={6}>
          <h3>Welcome to OpenSRP</h3>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
