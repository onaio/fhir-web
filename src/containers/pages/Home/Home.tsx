import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'reactstrap';

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>{'OpenSRP Web'}</title>
      </Helmet>
      <Row className="welcome-box">
        <Col>
          <h3>{'Welcome to OpenSRP'}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
