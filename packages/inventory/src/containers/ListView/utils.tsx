import React from 'react';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW } from '../../constants';
import { Link } from 'react-router-dom';
import lang, { Lang } from '../../lang';
import { LocationUnit, TreeNode } from '@opensrp/location-management';
import { Column } from '@opensrp/react-utils';

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
  return (
    <>
      <Link to={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${record.servicePointId}`}>
        {lang.VIEW}
      </Link>
    </>
  );
};

/**
 * service point list table columns factory
 *
 * @param langObj - the language translations lookup
 */
export const columnsFactory = (langObj: Lang = lang) => {
  const columns: Column<TableData>[] = [
    {
      title: langObj.SERVICE_POINT_TH,
      dataIndex: 'serviceName',
      key: 'serviceName',
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
      title: langObj.TYPE_TH,
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: langObj.LOCATION_TH,
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: langObj.SERVICE_POINT_ID_TH,
      dataIndex: 'servicePointId',
      key: 'servicePointId',
    },
  ];
  return columns;
};

/**
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
