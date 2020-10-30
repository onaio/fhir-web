import React, { useEffect, useState } from 'react';
import { Table as AntTable, Input, Form, Menu, Dropdown, Button, Divider, InputNumber } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  getAccessToken,
  store,
} from '@opensrp/store';
import { useDispatch, useSelector } from 'react-redux';

export interface data {
  key: string;
  name: string;
  status: 'Alive' | 'Not Active';
  type: string;
  created: Date;
  lastupdated: Date;
  externalid: string;
  openmrsid: string;
  username: string;
  version: string;
  syncstatus: 'Synced' | 'Not Synced';
  level: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'date';
  record: data;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item className="mb-0" name={dataIndex}>
          {inputType === 'date' ? <Input /> : inputType === 'number' ? <InputNumber /> : <Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export interface Props {
  data: data[];
  onViewDetails?: Function;
  accessToken: string;
}

const Table: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<data[]>(props.data);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    console.log(props.accessToken);

    const service = new OpenSRPService(
      props.accessToken as string,
      'https://opensrp-stage.smartregister.org/opensrp/rest/location',
      '/sync'
    );

    service.create({}).then((e) => {
      console.log(e);
    });
  });

  function edit(record: data) {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  }

  function cancel() {
    return setEditingKey('');
  }

  async function save(key: React.Key) {
    try {
      const row = (await form.validateFields()) as data;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }
      setData(newData);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      editable: true,
      sorter: (a: { level: number }, b: { level: number }) => a.level - b.level,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastupdated',
      render: (_: any, record: data) => record.lastupdated.toLocaleDateString('en-US'),
      editable: true,
      sorter: (a: { lastupdated: Date }, b: { lastupdated: Date }) =>
        a.lastupdated.toLocaleString('en-US').localeCompare(b.lastupdated.toLocaleString('en-US')),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      render: (_: any, record: data) => {
        const editable = record.key === editingKey;
        return (
          <span className="d-flex justify-content-end align-items-center">
            {editable ? (
              <>
                <Button type="link" className="p-1" onClick={() => save(record.key)}>
                  Save
                </Button>
                <Button type="link" className="m-0 p-1" danger onClick={() => cancel()}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="link" className="m-0 p-1" onClick={() => edit(record)}>
                  Edit
                </Button>
                <Divider type="vertical" />
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={(e) => (props.onViewDetails ? props.onViewDetails(e) : null)}
                      >
                        View Details
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                  arrow
                  trigger={['click']}
                >
                  <MoreOutlined className="more-options" />
                </Dropdown>
              </>
            )}
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: data) => ({
        record,
        inputType:
          col.dataIndex === 'level' ? 'number' : col.dataIndex === 'lastupdated' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.key === editingKey,
      }),
    };
  });

  return (
    <AntTable
      components={{ body: { cell: EditableCell } }}
      rowClassName="editable-row"
      dataSource={data}
      columns={mergedColumns}
    />
  );
};

export default Table;
