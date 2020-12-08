import React from 'react';
import { Spin, Alert, Button } from 'antd';
import { Assignment } from '../../ducks/assignments';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { TableColumnsNamespace } from '../../constants';

/** component rendered in the action column of the table */

export const ActionsColumnCustomRender: ColumnType<Assignment>['render'] = (record) => {
  return (
    <>
      <Button
        type="link"
        style={{ padding: '4px 0px' }}
        onClick={() => {
          record.setModalVisibility(true);
          record.setAssignedLocAndTeams({
            jurisdictionId: record.id,
            assignedTeams: record.assignedTeamIds,
          });
        }}
      >
        Edit
      </Button>
    </>
  );
};

/** product Catalogue table columns */
export const columns: ColumnsType<any> = [
  {
    title: 'Name',
    dataIndex: 'locationName',
    key: `${TableColumnsNamespace}-locationName`,
    defaultSortOrder: 'descend',
    sorter: (rec1, rec2) => {
      if (rec1.label > rec2.label) {
        return -1;
      } else if (rec1.label < rec2.label) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'Assigned Teams',
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
