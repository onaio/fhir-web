import React from 'react';
import { Spin, Alert } from 'antd';
import { ColumnType } from 'antd/lib/table/interface';
import { PLANS_ASSIGNMENT_VIEW_URL, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import { PlanDefinition } from '@opensrp/plan-form-core';
import moment from 'moment';
import { Dictionary } from '@onaio/utils';
import lang from '../../lang';
import { Column } from '@opensrp/react-utils';

/**
 * component rendered in the action column of the table
 *
 * @param record record representing the active record
 */
export const ActionsColumnCustomRender: ColumnType<PlanDefinition>['render'] = (record) => {
  return (
    <>
      <Link to={`${PLANS_ASSIGNMENT_VIEW_URL}/${record.identifier}`}>{lang.VIEW}</Link>
    </>
  );
};

/** generates columns for plan list component
 *
 * @param langObj - the language object
 */
export const getColumns = (langObj: Dictionary<string> = lang): Column<PlanDefinition>[] => {
  const columns: Column<PlanDefinition>[] = [
    {
      title: langObj.NAME,
      dataIndex: 'title',
      key: `${TableColumnsNamespace}-title` as keyof PlanDefinition,
      defaultSortOrder: 'descend',
      sorter: (rec1, rec2) => {
        if (rec1.title > rec2.title) {
          return -1;
        } else if (rec1.title < rec2.title) {
          return 1;
        }
        return 0;
      },
      width: '60%',
    },
    {
      title: lang.DATE,
      dataIndex: 'date',
      key: `${TableColumnsNamespace}-date` as keyof PlanDefinition,
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: lang.END_DATE,
      dataIndex: 'effectivePeriod',
      key: `${TableColumnsNamespace}-date` as keyof PlanDefinition,
      render: (item: Dictionary) => item.end,
    },
    {
      title: langObj.ACTIONS,
      key: `${TableColumnsNamespace}-actions` as keyof PlanDefinition,
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

/** util component shown when there is a pending promise */
export const PlansLoading = () => {
  return (
    <Spin tip={lang.TIP}>
      <Alert message={lang.MESSAGE} description={lang.DESCRIPTION} type="info" />
    </Spin>
  );
};

/**
 * Util method that determines pageTitle
 *
 * @param status - plan status
 * @param appendMissions - whether to add mission title
 * @param langObj - dictionary representing lang object
 */
export const pageTitleBuilder = (
  status?: string,
  appendMissions = true,
  langObj: Dictionary<string> = lang
) => {
  if (status) {
    return `${status.charAt(0).toUpperCase()}${status.slice(1)}${
      appendMissions ? ` ${langObj.MISSIONS}` : ''
    }`;
  }
  return langObj.NO_STATUS_FOUND;
};
