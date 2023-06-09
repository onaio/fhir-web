import { FileDoneOutlined } from '@ant-design/icons';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import { Avatar, Divider, Breadcrumb, Row, Col } from 'antd';
import { PlanStatusColors, URL_MISSIONS } from '../../constants';
import { pageTitleBuilder } from '../../containers/ListView/utils';
import { useTranslation } from '../../mls';
import React from 'react';
import { Link } from 'react-router-dom';
import { redirectMapping } from '../../helpers/common';
import { BreadcrumbProps } from 'antd/lib/breadcrumb/Breadcrumb';
import { Route } from 'react-router-dom';

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
  const { t } = useTranslation();

  const itemRender: BreadcrumbProps['itemRender'] = (route, _, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;
    const hasPath = !!route.path;
    return last || !hasPath ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  };

  const items = [
    {
      breadcrumbName: t('Missions'),
    },
    {
      path: redirectMapping[plan.status as PlanStatus],
      breadcrumbName: pageTitleBuilder(t, plan.status as PlanStatus, false),
    },
    {
      path: `${URL_MISSIONS}/${plan.status}/${plan.identifier}`,
      breadcrumbName: plan.title,
    },
  ];

  return (
    <div className="plan-detail-view">
      <Breadcrumb
        className="site-page-header-responsive"
        items={items}
        itemRender={itemRender}
      ></Breadcrumb>
      <Row className="plan-info-main">
        <Col md={12}>
          <div className="plan-avatar-detail-section">
            <span className="avatar-section">
              <Avatar
                /**Find the right icon */
                icon={<FileDoneOutlined rev={undefined} />}
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
                <Link to={`${URL_MISSIONS}/${plan.status}/edit/${planId}`}>{t('Edit')}</Link>
                <Divider type="vertical" />
                <span style={{ color: PlanStatusColors[plan.status] }}>
                  {pageTitleBuilder(t, plan.status as PlanStatus, false)}
                </span>
                <Divider type="vertical" />
              </div>
            </div>
          </div>
        </Col>
        <Col md={12} className="flex-right">
          <div className="plan-dates">
            <div className="plan-start-date">
              <span className="start-date">{t('Start Date')}</span>
              <h2>{plan.effectivePeriod.start}</h2>
            </div>
            <Divider className="date-divider" type="vertical" />
            <div className="plan-end-date">
              <span className="end-date">{t('End Date')}</span>
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
