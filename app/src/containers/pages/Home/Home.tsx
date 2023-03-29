import { Helmet } from 'react-helmet';
import { Col, Row, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import './Home.css';
import { useTranslation } from '../../../mls';
import React from 'react';
import { useSelector } from 'react-redux';
import { getExtraData } from '@onaio/session-reducer';
import { getRoutesForHomepage } from '../../../routes';

export const Home = () => {
  const { t } = useTranslation();
  const extraData = useSelector((state) => {
    return getExtraData(state);
  });
  const { roles } = extraData;
  const routes = React.useMemo(() => getRoutesForHomepage(roles as string[], t), [roles, t]);

  let columnNum = 2;
  if (routes.length < 5) {
    columnNum = 2;
  } else if (routes.length < 7) {
    columnNum = 3;
  } else {
    columnNum = 4;
  }

  const normalSpanLength = 24 / columnNum;

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
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
        className="links-box"
      >
        {routes.length === 0 && (
          <Alert
            message="403"
            description="Missing require permissions to view data on this page"
            type="warning"
          />
        )}
        {routes.map((route) => {
          return (
            <Col
              key={route.title}
              className="gutter-row"
              xl={normalSpanLength}
              lg={8}
              md={8}
              sm={12}
            >
              <Link to={route.url as string} className="admin-link">
                <Button color="outline" className="btn-links">
                  {route.title}
                </Button>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
