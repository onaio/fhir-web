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
      <Row justify="center">
        <Col span={4}>Welcome to OpenSRP</Col>
      </Row>
    </div>
  );
};

export default Home;
