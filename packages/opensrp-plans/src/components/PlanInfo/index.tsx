import { FileDoneOutlined } from '@ant-design/icons';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import { Avatar, Divider, Breadcrumb } from 'antd';
import { PlanStatusColors, PLANS_EDIT_VIEW_URL, PLANS_ASSIGNMENT_VIEW_URL } from '../../constants';
import { pageTitleBuilder } from '../../containers/ListView/utils';
import { EDIT, END_DATE, MISSIONS, START_DATE } from '../../lang';
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
      breadcrumbName: MISSIONS,
    },
    {
      path: redirectMapping[plan.status as PlanStatus],
      breadcrumbName: pageTitleBuilder(plan.status, false),
    },
    {
      path: `${PLANS_ASSIGNMENT_VIEW_URL}/${plan.identifier}`,
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

      <div className="plan-info-main">
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
            <div className="plan-description">
              <Link to={`${PLANS_EDIT_VIEW_URL}/${planId}`}>{EDIT}</Link>
              <Divider type="vertical" />
              <span style={{ color: PlanStatusColors[plan.status] }}>
                {pageTitleBuilder(plan.status, false)}
              </span>
              <Divider type="vertical" />
              <span>{plan.description}</span>
            </div>
          </div>
        </div>
        <div className="plan-dates">
          <div className="plan-start-date">
            <span className="start-date">{START_DATE}</span>
            <h2>{plan.effectivePeriod.start}</h2>
          </div>
          <Divider className="date-divider" type="vertical" />
          <div className="plan-end-date">
            <span className="end-date">{END_DATE}</span>
            <h2>{plan.effectivePeriod.end}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanInfo;
