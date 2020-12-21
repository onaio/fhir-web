import { FileDoneOutlined } from '@ant-design/icons';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { Avatar, Divider, PageHeader } from 'antd';
import { PlanStatusColors, PLANS_EDIT_VIEW_URL, PLANS_LIST_VIEW_URL } from '../../constants';
import { pageTitleBuilder } from '../../containers/ListView/utils';
import { EDIT, END_DATE, MISSIONS, START_DATE } from '../../lang';
import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
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
  const routes = [
    {
      path: PLANS_LIST_VIEW_URL,
      breadcrumbName: MISSIONS,
    },
    {
      path: `${PLANS_LIST_VIEW_URL}/${plan.status}`,
      breadcrumbName: pageTitleBuilder(plan.status, false),
    },
    {
      path: `/plan/planid?${plan.identifier}`,
      breadcrumbName: plan.title,
    },
  ];

  return (
    <>
      <PageHeader className="site-page-header" title="" breadcrumb={{ routes }} />

      <div className="plan-info-main">
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          /**Find the right icon */
          icon={<FileDoneOutlined />}
          className="plan-info-avatar"
          style={{
            width: 80,
            height: 82,
            lineHeight: 1.8,
            color: '#1CABE2',
          }}
        />
        <span className="plan-title">
          <h4>{plan.title}</h4>
          <Link to={`${PLANS_EDIT_VIEW_URL}/${planId}`}>{EDIT}</Link>
          <Divider type="vertical" />
          <span style={{ color: PlanStatusColors[plan.status] }}>
            {pageTitleBuilder(plan.status, false)}
          </span>
          <Divider type="vertical" />
          <span>{plan.description}</span>
        </span>
        <span className="plan-start">
          <span className="plan-start-title">{START_DATE}</span>
          <h2>{plan.effectivePeriod.start}</h2>
        </span>
        <Divider className="timing-period-divider" type="vertical" />
        <span className="plan-end">
          <span className="plan-end-title">{END_DATE}</span>
          <h2>{plan.effectivePeriod.end}</h2>
        </span>
      </div>
    </>
  );
};

export default PlanInfo;
