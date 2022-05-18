import React from 'react';
import { TableColumnsNamespace, URL_MISSIONS } from '../../constants';
import { Link } from 'react-router-dom';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import moment from 'moment';
import { Dictionary } from '@onaio/utils';
import { useTranslation } from '../../mls';
import { Column } from '@opensrp/react-utils';
import type { TFunction } from '@opensrp/i18n';

/**
 * component rendered in the action column of the table
 *
 * @param record record representing the active record
 */
export const ActionsColumnCustomRender: Column<PlanDefinition>['render'] = (
  record: PlanDefinition
) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Assumes the record status is in the routes */}
      <Link to={`${URL_MISSIONS}/${record.status}/${record.identifier}`}>{t('View')}</Link>
    </>
  );
};

/**
 * generates columns for plan list component
 *
 * @param t - the translator function
 */
export const getColumns = (t: TFunction): Column<PlanDefinition>[] => {
  const columns: Column<PlanDefinition>[] = [
    {
      title: t('Name'),
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
      title: t('Date'),
      dataIndex: 'date',
      key: `${TableColumnsNamespace}-date` as keyof PlanDefinition,
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: t('End Date'),
      dataIndex: 'effectivePeriod',
      key: `${TableColumnsNamespace}-date` as keyof PlanDefinition,
      render: (item: Dictionary) => item.end,
    },
    {
      title: t('Actions'),
      key: `${TableColumnsNamespace}-actions` as keyof PlanDefinition,
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

/**
 * Util method that determines pageTitle
 *
 * @param t - dictionary representing lang object
 * @param status - plan status
 * @param appendMissions - whether to add mission title
 */
export const pageTitleBuilder = (t: TFunction, status?: PlanStatus, appendMissions = true) => {
  const stringByStatus = {
    [PlanStatus.DRAFT]: t('Draft'),
    [PlanStatus.RETIRED]: t('Retired'),
    [PlanStatus.ACTIVE]: t('Active'),
    [PlanStatus.COMPLETE]: t('Complete'),
  };
  if (status) {
    return `${stringByStatus[status]}${appendMissions ? ` ${t('Missions')}` : ''}`;
  }
  return '';
};
