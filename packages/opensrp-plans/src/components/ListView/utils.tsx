import React from 'react';
import { Spin, Alert } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { PLANS_LIST_VIEW_URL, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import { PlanDefinition } from 'opensrp-plans/src/plan-global-types';

/** component rendered in the action column of the table */

export const ActionsColumnCustomRender: ColumnType<PlanDefinition>['render'] = (record) => {
  return (
    <>
      <Link to={`${PLANS_LIST_VIEW_URL}/${record.identifier}`}>View</Link>
    </>
  );
};

/**  plans table columns */
export const columns: ColumnsType<PlanDefinition> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: `${TableColumnsNamespace}-name`,
    width: '60%',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: `${TableColumnsNamespace}-date`,
    sorter: (rec1, rec2) => {
      if (rec1.date > rec2.date) {
        return 1;
      } else if (rec1.date < rec2.date) {
        return -1;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'Actions',
    key: `${TableColumnsNamespace}-actions`,
    render: ActionsColumnCustomRender,
    width: '20%',
  },
];

/** util component shown when there is a pending promise */

export const PlansLoading = () => {
  return (
    <Spin tip="Loading...">
      <Alert
        message="Fetching Plans"
        description="Please wait, as we fetch the plans."
        type="info"
      />
    </Spin>
  );
};
