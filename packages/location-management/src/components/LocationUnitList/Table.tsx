import React from 'react';
import { Table as AntTable, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import { ACTIONS, LEVEL, NAME, VIEW_DETAILS } from '../../lang';

export interface TableData {
  geographicLevel: number;
  id: string;
  key: string;
  name: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (row: TableData) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;

  return (
    <AntTable
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 20,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      dataSource={props.data}
    >
      <AntTable.Column
        defaultSortOrder="ascend"
        title={NAME}
        dataIndex="name"
        sorter={(a: TableData, b: TableData) => a.name.localeCompare(b.name)}
      />
      <AntTable.Column
        title={LEVEL}
        dataIndex="geographicLevel"
        sorter={(a: TableData, b: TableData) => a.geographicLevel - b.geographicLevel}
      />
      <AntTable.Column
        title={ACTIONS}
        dataIndex="operation"
        width="10%"
        // eslint-disable-next-line react/display-name
        render={(value: boolean, record: TableData) => (
          <span className="d-flex justify-content-end align-items-center">
            <Link to={URL_LOCATION_UNIT_EDIT + '/' + record.id}>
              <Button type="link" className="m-0 p-1">
                Edit
              </Button>
            </Link>
            <Divider type="vertical" />
            <Button
              type="link"
              className="m-0 p-1"
              onClick={() => {
                if (onViewDetails) onViewDetails(record);
              }}
            >
              {VIEW_DETAILS}
            </Button>
          </span>
        )}
      />
    </AntTable>
  );
};

export default Table;
