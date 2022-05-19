import React from 'react';
<<<<<<< HEAD
=======
import { Spin, Alert } from 'antd';
>>>>>>> 486-inventory
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW } from '../../constants';
import { Link } from 'react-router-dom';
import { LocationUnit, TreeNode } from '@opensrp/location-management';
import { Column } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { TFunction } from 'react-i18next';

/** Describes how the data will passed to the table */
export interface TableData {
  type: string;
  serviceName: string;
  location: string;
  servicePointId: string;
}

/**
 * component rendered in the action column of the table
 *
 * @param record - record to show in row
 */
export const ActionsColumnCustomRender: Column<TableData>['render'] = (record) => {
  const { t } = useTranslation();
  return (
    <>
      <Link to={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${record.servicePointId}`}>
        {t('View')}
      </Link>
    </>
  );
};

/**
 * service point list table columns factory
 *
 * @param t - translator function
 */
export const columnsFactory = (t: TFunction) => {
  const columns: Column<TableData>[] = [
    {
      title: t('Service point'),
      dataIndex: 'serviceName',
<<<<<<< HEAD
      key: 'serviceName',
=======
      key: 'serviceName' as keyof TableData,
>>>>>>> 486-inventory
      defaultSortOrder: 'descend',
      sorter: (rec1, rec2) => {
        if (rec1.serviceName > rec2.serviceName) {
          return -1;
        } else if (rec1.serviceName < rec2.serviceName) {
          return 1;
        } else {
          return 0;
        }
      },
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('Location'),
      dataIndex: 'location',
<<<<<<< HEAD
      key: 'location',
=======
      key: 'location' as keyof TableData,
>>>>>>> 486-inventory
    },
    {
      title: t('Service point ID'),
      dataIndex: 'servicePointId',
      key: 'servicePointId',
    },
  ];
  return columns;
};

/**
<<<<<<< HEAD
=======
 * util component shown when there is a pending promise
 *
 * @param root0 - object argument containing below args
 * @param root0.message - message to show as title
 * @param root0.description - description of error to show
 */
export const ServicePointsLoading = () => {
  const { t } = useTranslation();
  return (
    <Spin tip={t('Loading ...')}>
      <Alert
        message={t('Fetching locations')}
        description={t('Please wait, while locations are being fetched')}
        type="info"
      />
    </Spin>
  );
};

/**
>>>>>>> 486-inventory
 * function to get the parent path of a location
 *
 * @param loc - the location whose path we want
 * @param trees - the tree nodes containing the hierarchy
 */
export const getNodePath = (loc: LocationUnit, trees: TreeNode[] = []): string => {
  const { parentId } = loc.properties;
  // find tree with node that has the given id
  let nodeOfInterest: TreeNode | undefined;
  trees.forEach((tree) => {
    nodeOfInterest = tree.first((node) => node.model.id === parentId);
  });
  if (!nodeOfInterest) {
    return '';
  }
  // get path
  const path = nodeOfInterest.getPath().map((node) => node.model.label);
  return path.join(' > ');
};
