import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { loadPlans } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import {
  fetchPlanDefinitions,
  makePlanDefinitionsArraySelector,
} from '../../ducks/planDefinitions';
import { connect } from 'react-redux';
import { getColumns, pageTitleBuilder } from './utils';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { plansReducer, plansReducerName as PlansReducerName } from '../../ducks/planDefinitions';
import { BrokenPage, TableLayout, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  PLANS_CREATE_VIEW_URL,
  RouteParams,
  SORT_BY_EFFECTIVE_PERIOD_START_FIELD,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import { useTranslation } from '../../mls';
import '@opensrp/react-utils/dist/components/CommonStyles/index.css';

/** make sure plans reducer is registered */
reducerRegistry.register(PlansReducerName, plansReducer);

/** props for the PlansList view */
interface Props<T = PlanDefinition> extends CommonProps {
  data: T[];
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
  allowedPlanStatus: PlanStatus;
}

const defaultProps = {
  ...defaultCommonProps,
  data: [],
  fetchPlansCreator: fetchPlanDefinitions,
  service: OpenSRPService,
  allowedPlanStatus: PlanStatus.ACTIVE,
};

export type PlansListTypes = Props<PlanDefinition> & RouteComponentProps<RouteParams>;

/** component that renders plans */

const PlansList = (props: PlansListTypes) => {
  const { service, data, fetchPlansCreator, baseURL, allowedPlanStatus } = props;
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const { t } = useTranslation();

  const history = useHistory();

  useEffect(() => {
    loadPlans(baseURL, service, fetchPlansCreator, allowedPlanStatus)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = pageTitleBuilder(t, allowedPlanStatus);

  const columns = getColumns(t);

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <div className="main-content__header flex-right">
            <Button type="primary" className="mr-0" onClick={() => history.push(PLANS_CREATE_VIEW_URL)}>
              {t(' + New Mission')}
            </Button>
          </div>
          <TableLayout id="PlansList" persistState={true} datasource={data} columns={columns} />
        </Col>
      </Row>
    </div>
  );
};

PlansList.defaultProps = defaultProps;

export { PlansList };

export type MapStateToProps = Pick<PlansListTypes, 'data'>;
export type MapDispatchToProps = Pick<PlansListTypes, 'fetchPlansCreator'>;

export const mapStateToProps = (
  state: Partial<Store>,
  ownProps: PlansListTypes
): MapStateToProps => {
  const plansByStatus = makePlanDefinitionsArraySelector(
    undefined,
    SORT_BY_EFFECTIVE_PERIOD_START_FIELD
  );
  const data = plansByStatus(state, {
    status: ownProps.allowedPlanStatus,
  });
  return {
    data,
  };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchPlansCreator: fetchPlanDefinitions,
};

const ConnectedPlansList = connect(mapStateToProps, mapDispatchToProps)(PlansList);
export { ConnectedPlansList };
