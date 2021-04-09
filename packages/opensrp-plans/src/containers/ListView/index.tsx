import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { loadPlans } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import {
  fetchPlanDefinitions,
  makePlanDefinitionsArraySelector,
} from '../../ducks/planDefinitions';
import { connect } from 'react-redux';
import { PlansLoading, getColumns, pageTitleBuilder } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { plansReducer, plansReducerName as PlansReducerName } from '../../ducks/planDefinitions';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  PLANS_CREATE_VIEW_URL,
  RouteParams,
  SORT_BY_EFFECTIVE_PERIOD_START_FIELD,
  TableColumnsNamespace,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import '@opensrp/react-utils/dist/components/CommonStyles/index.css';
import lang from '../../lang';

/** make sure plans reducer is registered */
reducerRegistry.register(PlansReducerName, plansReducer);

/** props for the PlansList view */
interface Props<T = PlanDefinition> extends CommonProps {
  data: T[];
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
  allowedPlanStatus: string;
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

  useEffect(() => {
    loadPlans(baseURL, service, fetchPlansCreator, allowedPlanStatus)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <PlansLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = pageTitleBuilder(allowedPlanStatus);
  // add a key prop to the array data to be consumed by the table
  const dataSource = data.map((singleObject, key) => {
    const planWithKey = {
      ...singleObject,
      key: `${TableColumnsNamespace}-${key}`,
    };
    return planWithKey;
  });

  const columns = getColumns();

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <div className="main-content__header flex-right">
            <Link to={PLANS_CREATE_VIEW_URL}>
              <Button type="primary" className="mr-0">
                {lang.NEW_MISSION}
              </Button>
            </Link>
          </div>
          <Table dataSource={dataSource} columns={columns}></Table>
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
