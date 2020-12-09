import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { loadPlans } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import { fetchPlanDefinitions, getPlanDefinitionsArrayByStatus } from '../../ducks';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { PlansLoading, columns } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import PlansReducer, { reducerName as PlansReducerName } from '../../ducks';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  PLANS_CREATE_VIEW_URL,
  RouteParams,
  SORT_BY_EFFECTIVE_PERIOD_START_FIELD,
  TableColumnsNamespace,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { ACTIVE_MISSIONS, NEW_MISSION } from '../../lang';
import { descendingOrderSort } from '../../helpers/utils';

/** make sure plans reducer is registered */
reducerRegistry.register(PlansReducerName, PlansReducer);

/** props for the PlansList view */
interface Props<T = PlanDefinition> extends CommonProps {
  data: T[];
  columns: ColumnsType<T>;
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
  allowedPlanStatus: string | undefined;
}

const defaultProps = {
  ...defaultCommonProps,
  data: [],
  columns: columns,
  fetchPlansCreator: fetchPlanDefinitions,
  service: OpenSRPService,
  allowedPlanStatus: undefined,
};

export type PlansListTypes = Props<PlanDefinition> & RouteComponentProps<RouteParams>;

/** component that renders plans */

const PlansList = (props: PlansListTypes) => {
  const { service, data, columns, fetchPlansCreator, baseURL, allowedPlanStatus } = props;
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

  const pageTitle = ACTIVE_MISSIONS;
  // add a key prop to the array data to be consumed by the table
  const dataSource = data.map((singleObject, key) => {
    const planWithKey = {
      ...singleObject,
      key: `${TableColumnsNamespace}-${key}`,
    };
    return planWithKey;
  });

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <Link to={PLANS_CREATE_VIEW_URL}>
              <Button type="primary" size="large">
                {NEW_MISSION}
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
  let data = getPlanDefinitionsArrayByStatus()(state, {
    status: ownProps.allowedPlanStatus,
  });
  if (data.length) {
    data = descendingOrderSort(data, SORT_BY_EFFECTIVE_PERIOD_START_FIELD);
  }
  return {
    data,
  };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchPlansCreator: fetchPlanDefinitions,
};

const ConnectedPlansList = connect(mapStateToProps, mapDispatchToProps)(PlansList);
export { ConnectedPlansList };
