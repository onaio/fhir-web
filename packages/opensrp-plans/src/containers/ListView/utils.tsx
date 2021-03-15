import React from 'react';
import { Spin, Alert } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { PLANS_ASSIGNMENT_VIEW_URL, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import { PlanDefinition } from '@opensrp/plan-form-core';
import moment from 'moment';
import { Dictionary } from '@onaio/utils';
import {
  NAME,
  DATE,
  ACTIONS,
  TIP,
  MESSAGE,
  DESCRIPTION,
  MISSIONS,
  NO_STATUS_FOUND,
  END_DATE,
} from '../../lang';

/** component rendered in the action column of the table */

export const ActionsColumnCustomRender: ColumnType<PlanDefinition>['render'] = (record) => {
  return (
    <>
      <Link to={`${PLANS_ASSIGNMENT_VIEW_URL}/${record.identifier}`}>View</Link>
    </>
  );
};

/**  plans table columns */
export const columns: ColumnsType<PlanDefinition> = [
  {
    title: NAME,
    dataIndex: 'title',
    key: `${TableColumnsNamespace}-title`,
    defaultSortOrder: 'descend',
    sorter: (rec1, rec2) => {
      if (rec1.title > rec2.title) {
        return -1;
      } else if (rec1.title < rec2.title) {
        return 1;
      }
      return 0;
    },
    width: '50%',
  },
  {
    title: DATE,
    dataIndex: 'date',
    key: `${TableColumnsNamespace}-date`,
    sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
  },
  {
    title: END_DATE,
    dataIndex: 'effectivePeriod',
    key: `${TableColumnsNamespace}-date`,
    render: (item: Dictionary) => item.end,
  },
  {
    title: ACTIONS,
    key: `${TableColumnsNamespace}-actions`,
    render: ActionsColumnCustomRender,
    width: '20%',
  },
];

/** util component shown when there is a pending promise */

export const PlansLoading = () => {
  return (
    <Spin tip={TIP}>
      <Alert message={MESSAGE} description={DESCRIPTION} type="info" />
    </Spin>
  );
};

/** Util method that determines pageTitle */

export const pageTitleBuilder = (status?: string, appendMissions = true) => {
  if (status) {
    return `${status.charAt(0).toUpperCase()}${status.slice(1)}${
      appendMissions ? ` ${MISSIONS}` : ''
    }`;
  }
  return NO_STATUS_FOUND;
};
