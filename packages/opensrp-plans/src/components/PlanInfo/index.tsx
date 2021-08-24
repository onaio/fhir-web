import { FileDoneOutlined } from '@ant-design/icons';
import { PlanDefinition, PlanStatus } from '@opensrp-web/plan-form-core';
import { Avatar, Divider, Breadcrumb, Row, Col } from 'antd';
import { PlanStatusColors, URL_MISSIONS } from '../../constants';
import { pageTitleBuilder } from '../../containers/ListView/utils';
import lang from '../../lang';
import React from 'react';
import { Link } from 'react-router-dom';
import { redirectMapping } from '../../helpers/common';
import { Route, BreadcrumbProps } from 'antd/lib/breadcrumb/Breadcrumb';

/** interface describing the props of PlanInfo */
export interface PlanInfoProps {
  plan: PlanDefinition;
  planId: string;
}
/**
 *
 * @param {object} props component props
 * @returns {React.ReactElement} returns html elements
 */
const PlanInfo = (props: PlanInfoProps) => {
  const { plan, planId } = props;

  const itemRender: BreadcrumbProps['itemRender'] = (route, _, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;
    const hasPath = !!route.path;
    return last || !hasPath ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  };

  const routes = [
    {
      breadcrumbName: lang.MISSIONS,
    },
    {
      path: redirectMapping[plan.status as PlanStatus],
      breadcrumbName: pageTitleBuilder(plan.status as PlanStatus, false),
    },
    {
      path: `${URL_MISSIONS}/${plan.status}/${plan.identifier}`,
      breadcrumbName: plan.title,
    },
  ] as Route[];

  return (
    <div className="plan-detail-view">
      <Breadcrumb
        className="site-page-header-responsive"
        routes={routes}
        itemRender={itemRender}
      ></Breadcrumb>
      <Row className="plan-info-main">
        <Col md={12}>
          <div className="plan-avatar-detail-section">
            <span className="avatar-section">
              <Avatar
                /**Find the right icon */
                icon={<FileDoneOutlined />}
                className=""
                style={{
                  width: 80,
                  height: 82,
                  lineHeight: 1.8,
                  color: '#1CABE2',
                  fontSize: 50,
                }}
              />
            </span>
            <div className="plan-detail-section">
              <div>
                <h4>{plan.title}</h4>
              </div>
              <div>
                <Link to={`${URL_MISSIONS}/${plan.status}/edit/${planId}`}>{lang.EDIT}</Link>
                <Divider type="vertical" />
                <span style={{ color: PlanStatusColors[plan.status] }}>
                  {pageTitleBuilder(plan.status as PlanStatus, false)}
                </span>
                <Divider type="vertical" />
              </div>
            </div>
          </div>
        </Col>
        <Col md={12} className="flex-right">
          <div className="plan-dates">
            <div className="plan-start-date">
              <span className="start-date">{lang.START_DATE}</span>
              <h2>{plan.effectivePeriod.start}</h2>
            </div>
            <Divider className="date-divider" type="vertical" />
            <div className="plan-end-date">
              <span className="end-date">{lang.END_DATE}</span>
              <h2>{plan.effectivePeriod.end}</h2>
            </div>
          </div>
        </Col>
        <Col md={24}>
          <div className="plan-description">
            <span>{plan.description}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlanInfo;
