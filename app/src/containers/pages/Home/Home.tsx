import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Dictionary } from '@onaio/utils';
import './Home.css';
import lang from '../../../lang';
import {
  URL_USER,
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAM_ASSIGNMENT,
  URL_TEAMS,
} from '../../../constants';
import {
  ENABLE_LOCATIONS,
  ENABLE_TEAMS,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
} from '../../../configs/env';
import { useTranslation } from 'react-i18next';

export interface HomeProps {
  extraData: Dictionary;
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const { extraData } = props;
  const { roles } = extraData;
  const { t } = useTranslation();
  return (
    <div className="text-center home">
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row justify="center" className="weclome-box">
        <Col span={6}>
          <h3>{lang(t).WELCOME_TO_OPENSRP}</h3>
        </Col>
      </Row>
      <Row gutter={16} className="links-box">
        {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_USER} className="admin-link">
              <Button color="outline" className="btn-links">
                {lang(t).USER_MANAGEMENT}
              </Button>
            </Link>
          </Col>
        )}
        {ENABLE_TEAMS && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_TEAMS} className="admin-link">
              <Button color="outline" className="btn-links">
                {lang(t).TEAM_MANAGEMENT}
              </Button>
            </Link>
          </Col>
        )}
      </Row>
      <Row gutter={16} className="links-box">
        {ENABLE_LOCATIONS && (
          <>
            <Col className="gutter-row" span={12}>
              <Link to={URL_LOCATION_UNIT} className="admin-link">
                <Button color="outline" className="btn-links">
                  {lang(t).LOCATION_UNITS}
                </Button>
              </Link>
            </Col>

            <Col className="gutter-row" span={12}>
              <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                <Button color="outline" className="btn-links">
                  {lang(t).LOCATION_UNIT_GROUP}
                </Button>
              </Link>
            </Col>
          </>
        )}
      </Row>
      <Row gutter={16} className="links-box">
        {ENABLE_TEAMS_ASSIGNMENT_MODULE && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_TEAM_ASSIGNMENT} className="admin-link">
              <Button color="outline" className="btn-links">
                {lang(t).TEAM_ASSIGNMENT}
              </Button>
            </Link>
          </Col>
        )}
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
