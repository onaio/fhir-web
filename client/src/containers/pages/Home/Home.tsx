import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Dictionary } from '@onaio/utils';
import './Home.css';
import {
  TEAM_ASSIGNMENT,
  LOCATIONS_UNIT,
  LOCATIONS_UNIT_GROUP,
  TEAMS,
  URL_ADMIN,
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAM_ASSIGNMENT,
  URL_TEAMS,
} from '../../../constants';
import { ENABLE_LOCATIONS, ENABLE_TEAMS } from '../../../configs/env';

export interface HomeProps {
  extraData: Dictionary;
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const { extraData } = props;
  const { roles } = extraData;
  return (
    <div className="text-center home">
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
            <Link to={URL_ADMIN} className="admin-link">
              <Button color="outline" className="btn-links">
                Admin
              </Button>
            </Link>
          </Col>
        )}
        {ENABLE_TEAMS && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_TEAMS} className="admin-link">
              <Button color="outline" className="btn-links">
                {TEAMS}
              </Button>
            </Link>
          </Col>
        )}
        {ENABLE_LOCATIONS && (
          <>
            <Col className="gutter-row" span={12}>
              <Link to={URL_LOCATION_UNIT} className="admin-link">
                <Button color="outline" className="btn-links">
                  {LOCATIONS_UNIT}
                </Button>
              </Link>
            </Col>

            <Col className="gutter-row" span={12}>
              <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                <Button color="outline" className="btn-links">
                  {LOCATIONS_UNIT_GROUP}
                </Button>
              </Link>
            </Col>
          </>
        )}
      </Row>
      <Row gutter={16} className="links-box">
        <Col className="gutter-row" span={12}>
          <Link to={URL_TEAM_ASSIGNMENT} className="admin-link">
            <Button color="outline" className="btn-links">
              {TEAM_ASSIGNMENT}
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
