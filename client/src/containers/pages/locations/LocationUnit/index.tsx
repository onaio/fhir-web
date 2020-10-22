import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Table, Input, Form, Row, Col, Menu, Dropdown, Button, Divider, InputNumber } from 'antd';
import { MoreOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import './LocationUnit.css';
import LocationDetail from '../LocationDetail';
import Tree, { TREE } from '../../../../utils/Tree';

interface Item {
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

const tableData: Item[] = [];
for (let i = 0; i < 100; i++) {
  tableData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    level: 2,
    lastupdated: new Date('Thu Oct 22 2020 14:15:56 GMT+0500 (Pakistan Standard Time)'),
    status: 'Alive',
    type: 'Feautire',
    created: new Date('Thu Oct 22 2020 14:15:56 GMT+0500 (Pakistan Standard Time)'),
    externalid: `asdkjh123${i}`,
    openmrsid: `asdasdasdkjh123${i}`,
    username: `edward ${i}`,
    version: `${i}`,
    syncstatus: 'Synced',
  });
}

const tree: TREE[] = [
  {
    title: 'Sierra Leone',
    key: 'Sierra Leone',
    children: [
      { title: 'Bo', key: 'Bo', children: [{ title: '1', key: '1' }] },
      { title: 'Bombali', key: 'Bombali', children: [{ title: '2', key: '2' }] },
      {
        title: 'Bonthe',
        key: 'Bonthe',
        children: [
          {
            title: 'Kissi Ten',
            key: 'Kissi Ten',
            children: [{ title: 'Bayama CHP', key: 'Bayama CHP' }],
          },
        ],
      },
    ],
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'date';
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

const LocationUnit: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [editingKey, setEditingKey] = useState('');
  const [detail, setDetail] = useState<Item | null>(null);

  function edit(record: Item) {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  }

  function cancel() {
    return setEditingKey('');
  }

  async function save(key: React.Key) {
    try {
      const row = (await form.validateFields()) as Item;
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
      render: (_: any, record: Item) => record.lastupdated.toLocaleDateString('en-US'),
      editable: true,
      sorter: (a: { lastupdated: Date }, b: { lastupdated: Date }) =>
        a.lastupdated.toLocaleString('en-US').localeCompare(b.lastupdated.toLocaleString('en-US')),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      render: (_: any, record: Item) => {
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
                      <Menu.Item onClick={() => setDetail(record)}>View Details</Menu.Item>
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
      onCell: (record: Item) => ({
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
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={tree} />
        </Col>
        <Col className="bg-white p-3 border-left" span={detail ? 13 : 18}>
          <div className="mb-3 d-flex justify-content-between">
            <h5 className="mt-4">Bombali</h5>
            <div>
              <Button type="primary">
                <PlusOutlined />
                Add location unit
              </Button>
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Logout</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button shape="circle" icon={<SettingOutlined />} type="text" />
              </Dropdown>
            </div>
          </div>
          <div className="bg-white p-4">
            <Form form={form} component={false}>
              <Table
                components={{ body: { cell: EditableCell } }}
                rowClassName="editable-row"
                dataSource={data}
                columns={mergedColumns}
              />
            </Form>
          </div>
        </Col>

        {detail && (
          <Col className="pl-3" span={5}>
            <LocationDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        )}
      </Row>
    </section>
  );
};

export default LocationUnit;
