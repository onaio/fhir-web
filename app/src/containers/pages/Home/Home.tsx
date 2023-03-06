import { Helmet } from 'react-helmet';
import { Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import './Home.css';
import { useTranslation } from '../../../mls';
import { URL_USER, URL_LOCATION_UNIT, URL_TEAM_ASSIGNMENT, URL_TEAMS } from '../../../constants';
import { ENABLE_TEAMS_ASSIGNMENT_MODULE } from '../../../configs/env';
import React from 'react';
import {
  COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT,
  COMPOSITE_ENABLE_TEAM_MANAGEMENT,
  COMPOSITE_ENABLE_USER_MANAGEMENT,
} from '../../../configs/settings';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center home">
      <Helmet>
        <title>{t('OpenSRP Web')}</title>
      </Helmet>
      <Row justify="center" className="weclome-box">
        <Col span={6}>
          <h3>{t('Welcome to OpenSRP')}</h3>
        </Col>
      </Row>
      <Row gutter={16} className="links-box">
        {COMPOSITE_ENABLE_USER_MANAGEMENT && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_USER} className="admin-link">
              <Button color="outline" className="btn-links">
                {t('User Management')}
              </Button>
            </Link>
          </Col>
        )}
        {COMPOSITE_ENABLE_TEAM_MANAGEMENT && (
          <Col className="gutter-row" span={12}>
            <Link to={URL_TEAMS} className="admin-link">
              <Button color="outline" className="btn-links">
                {t('Team Management')}
              </Button>
            </Link>
          </Col>
        )}
      </Row>
      <Row gutter={16} className="links-box">
        {COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT && (
          <>
            <Col className="gutter-row" span={12}>
              <Link to={URL_LOCATION_UNIT} className="admin-link">
                <Button color="outline" className="btn-links">
                  {t('Location Units')}
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
                {t('Team Assignment')}
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </div>
  );
};
