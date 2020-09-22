import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';

import './Home.css';
import { getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';

const Home: React.FC = (props: any): JSX.Element => {
  const { extraData } = props;
  const { roles } = extraData;
  return (
    <div className="text-center">
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row justify="center" className="weclome-box">
        <Col span={6}>
          <h3>Welcome to OpenSRP</h3>
        </Col>
      </Row>
      <Row gutter={16} className="links-box">
        {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
          <Col className="gutter-row" span={12}>
            <Link to="/admin" className="admin-link">
              <Button color="outline" className="btn-links">
                Admin
              </Button>
            </Link>
          </Col>
        )}
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

export { Home };

/** Connect the component to the store */

/** map state to props */

const mapStateToProps = (state: Partial<Store>) => {
  const result = {
    extraData: getExtraData(state),
  };
  return result;
};

/** create connected component */

/** Connected Header component
 */
const ConnectedHomeComponent = connect(mapStateToProps)(Home);

export default ConnectedHomeComponent;
