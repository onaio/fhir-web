import React, { useEffect, useState } from 'react';
import { loadSinglePlan } from '../../../helpers/dataLoaders';
import { OpenSRPService } from '../../../helpers/dataLoaders';
import { fetchPlanDefinitions, getPlanDefinitionById } from '../../../ducks';
import { connect } from 'react-redux';
import { PlansLoading, pageTitleBuilder } from '../../ListView/utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import PlansReducer, { reducerName as PlansReducerName } from '../../../ducks';
import { BrokenPage, Resource404, useHandleBrokenPage } from '@opensrp/react-utils';
import { PlanStatusColors, PLANS_LIST_VIEW_URL, RouteParams } from '../../../constants';
import { FileExcelFilled } from '@ant-design/icons';
import { CommonProps, defaultCommonProps } from '../../../helpers/common';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { Avatar, Divider, PageHeader } from 'antd';
import './index.css';
import { EDIT, END_DATE, MISSIONS, START_DATE } from '../../../lang';

/** make sure plans reducer is registered */
reducerRegistry.register(PlansReducerName, PlansReducer);

/** props for the PlanInfo view  extends CommonProps*/
interface PlanInfoProps extends CommonProps {
  plan: PlanDefinition | null;
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
}

const defaultProps = {
  ...defaultCommonProps,
  plan: null,
  fetchPlansCreator: fetchPlanDefinitions,
  service: OpenSRPService,
};

export type PlanInfoTypes = PlanInfoProps & RouteComponentProps<RouteParams>;

/** component that renders plans */

const PlanInfo = (props: PlanInfoTypes) => {
  const { service, plan, fetchPlansCreator, baseURL } = props;
  const { planId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!plan);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  useEffect(() => {
    const idOfPlan = planId as string;
    loadSinglePlan(baseURL, idOfPlan, service, fetchPlansCreator)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  if (loading) {
    return <PlansLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }
  if (!plan && planId) {
    return <Resource404 />;
  }

  /** Page Header routes */
  let routes, planStatusColor;
  if (plan) {
    routes = [
      {
        path: PLANS_LIST_VIEW_URL,
        breadcrumbName: MISSIONS,
      },
      {
        path: `${PLANS_LIST_VIEW_URL}/${plan.status}`,
        breadcrumbName: pageTitleBuilder(plan.status),
      },
      {
        path: `/plan/planid?${plan.identifier}`,
        breadcrumbName: plan.title,
      },
    ];

    planStatusColor = PlanStatusColors[plan.status];
  }
  return (
    <div className="plan-info-header content-section">
      <PageHeader className="site-page-header" title="" breadcrumb={{ routes }} />

      <div className="plan-info-main">
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          /**Find the right icon */
          icon={<FileExcelFilled />}
          className="plan-info-avatar"
          style={{
            width: 80,
            height: 82,
            lineHeight: 1.8,
          }}
        />
        <span className="plan-title">
          <h4>{plan?.title}</h4>
          <Link to="#">{EDIT}</Link>
          <Divider type="vertical" />
          <Link to="#" style={{ color: planStatusColor }}>
            {plan?.status}
          </Link>
          <Divider type="vertical" />
          <span>{plan?.description}</span>
        </span>
        <span className="plan-start">
          <span className="plan-start-title">{START_DATE}</span>
          <h2>{plan?.effectivePeriod.start}</h2>
        </span>
        <Divider className="timing-period-divider" type="vertical" />
        <span className="plan-end">
          <span className="plan-end-title">{END_DATE}</span>
          <h2>{plan?.effectivePeriod.end}</h2>
        </span>
      </div>
    </div>
  );
};

PlanInfo.defaultProps = defaultProps;

export { PlanInfo };

/** Interface for connected state to props */
interface MapStateToProps {
  plan: PlanDefinition | null;
}

const mapStateToProps = (state: Partial<Store>, ownProps: PlanInfoTypes): MapStateToProps => {
  const planId = ownProps.match.params.planId ?? '';
  const plan = getPlanDefinitionById(state, planId);
  return { plan };
};

const mapDispatchToProps = {
  fetchPlansCreator: fetchPlanDefinitions,
};

const ConnectedPlanInfo = connect(mapStateToProps, mapDispatchToProps)(PlanInfo);
export { ConnectedPlanInfo };
