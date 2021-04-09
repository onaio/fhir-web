import React from 'react';
import { Spin, Alert } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import lang, { Lang } from '../../lang';
import { LocationUnit, TreeNode } from '@opensrp/location-management';
import { Column } from '@opensrp/react-utils';

/** Describes how the data will passed to the table */
export interface TableData {
  key: string;
  type: string;
  serviceName: string;
  location: string;
  servicePointId: string;
}

/** component rendered in the action column of the table
 *
 * @param record - record to show in row
 */
export const ActionsColumnCustomRender: ColumnType<TableData>['render'] = (record) => {
  return (
    <>
      <Link to={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${record.servicePointId}`}>
        {lang.VIEW}
      </Link>
    </>
  );
};

/** service point list table columns factory
 *
 * @param langObj - the language translations lookup
 */
export const columnsFactory = (langObj: Lang = lang) => {
  const columns: Column<TableData>[] = [
    {
      title: langObj.SERVICE_POINT_TH,
      dataIndex: 'serviceName',
      key: `${TableColumnsNamespace}-${langObj.SERVICE_POINT_TH}` as keyof TableData,
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
      key: `${TableColumnsNamespace}-${langObj.TYPE_TH}` as keyof TableData,
    },
    {
      title: langObj.LOCATION_TH,
      dataIndex: 'location',
      key: `${TableColumnsNamespace}-${langObj.LOCATION_TH}` as keyof TableData,
    },
    {
      title: langObj.SERVICE_POINT_ID_TH,
      dataIndex: 'servicePointId',
      key: `${TableColumnsNamespace}-${langObj.SERVICE_POINT_ID_TH}` as keyof TableData,
    },
    {
      title: langObj.ACTIONS_TH,
      key: `${TableColumnsNamespace}-actions` as keyof TableData,
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

/**
 * util component shown when there is a pending promise
 *
 * @param root0 - object argument containing below args
 * @param root0.message - message to show as title
 * @param root0.description - description of error to show
 */
export const ServicePointsLoading = ({
  message = lang.FETCHING_LOCATIONS,
  description = lang.FETCHING_LOCATIONS_DESCRIPTION,
}) => {
  return (
    <Spin tip={lang.LOADING_ELLIPSIS}>
      <Alert message={message} description={description} type="info" />
    </Spin>
  );
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
