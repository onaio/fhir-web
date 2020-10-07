import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
} from 'antd';
import { MoreOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom';
import { getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
// import { Dictionary } from '@onaio/utils';
import '../Location.css';
interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const LocationUnitGroup = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="Sure to Delete?"
          onConfirm={() => {
            console.log('');
          }}
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '90%',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <p onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </p>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <p>Cancel</p>
            </Popconfirm>
          </span>
        ) : (
          <span className="location-table-action">
            <p className="edit" onClick={() => edit(record)}>
              Edit
            </p>
            <Dropdown overlay={menu} placement="bottomLeft" arrow trigger={['click']}>
              <MoreOutlined className="more-options" />
            </Dropdown>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Helmet>
        <title>OpenSRP Web</title>
      </Helmet>
      <Row justify="start" className="weclome-box">
        <Col span={24}>
          <h5>Location Unit Group Management</h5>
        </Col>
      </Row>
      <div className="table-container">
        <div className="table-container-header"></div>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </>
  );
};

export { LocationUnitGroup };

/** Connect the component to the store */

/** map state to props */

const mapStateToProps = (state: Partial<Store>) => {
  const result = {
    extraData: getExtraData(state),
  };
  return result;
};

/** create connected component */

/** Connected Header component
 */
const ConnectedLocationUnitGroupComponent = connect(mapStateToProps)(LocationUnitGroup);

export default ConnectedLocationUnitGroupComponent;
