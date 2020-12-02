import React from 'react';
import { Spin, Alert } from 'antd';
import { Assignment } from '../../ducks/assignments';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { TEAM_ASSIGNMENT_EDIT_VIEW_URL, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';

/** component rendered in the action column of the table */

export const ActionsColumnCustomRender: ColumnType<Assignment>['render'] = (record) => {
  return (
    <>
      <Link to={`${TEAM_ASSIGNMENT_EDIT_VIEW_URL}/${record.uniqueId}`}>Edit</Link>
    </>
  );
};

/** product Catalogue table columns */
export const columns: ColumnsType<Assignment> = [
  {
    title: 'Name',
    dataIndex: 'locationName',
    key: `${TableColumnsNamespace}-locationName`,
    defaultSortOrder: 'descend',
    sorter: (rec1, rec2) => {
      if (rec1.jurisdictionId > rec2.jurisdictionId) {
        return -1;
      } else if (rec1.jurisdictionId < rec2.jurisdictionId) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'AssignedTeams',
    dataIndex: 'assignedTeams',
    key: `${TableColumnsNamespace}-assignedTeams`,
  },
  {
    title: 'Actions',
    key: `${TableColumnsNamespace}-actions`,
    render: ActionsColumnCustomRender,
    width: '20%',
  },
];

/** util component shown when there is a pending promise */

export const TeamAssignmentLoading = () => {
  return (
    <Spin tip="Loading...">
      <Alert
        message="Fetching Assigned Locations and Teams"
        description="Please wait, as we fetch Assigned Locations and Teams."
        type="info"
      />
    </Spin>
  );
};
