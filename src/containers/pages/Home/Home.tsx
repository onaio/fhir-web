import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';

import './Home.css';

const Home: React.FC = (): JSX.Element => {
  return (
    <div className="text-center">
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row justify="center" className="weclome-box">
        <Col span={4}>
          <h3>Welcome to OpenSRP</h3>
        </Col>
      </Row>
      <Row gutter={16} className="links-box">
        <Col className="gutter-row" span={12}>
          <Link to="/admin" className="admin-link">
            <Button color="outline" className="btn-links">
              Admin
            </Button>
          </Link>
        </Col>
        <Col className="gutter-row" span={12}>
          <Link to="/teams" className="admin-link">
            <Button color="outline" className="btn-links">
              Teams
            </Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
