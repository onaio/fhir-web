import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Table,
  Input,
  Form,
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
  Tree,
  Divider,
  Popconfirm,
} from 'antd';
import { MoreOutlined, SearchOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
import './LocationUnit.css';
import LocationDetail from '../LocationDetail';

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
    lastupdated: new Date(),
    status: 'Alive',
    type: 'Feautire',
    created: new Date(),
    externalid: `asdkjh123${i}`,
    openmrsid: `asdasdasdkjh123${i}`,
    username: `edward ${i}`,
    version: `${i}`,
    syncstatus: 'Synced',
  });
}

interface tree {
  title: string;
  key: string;
  children?: tree[];
}

function getParentKey(key: any, tree: string | any[]): any {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: any }) => item.key === key)) parentKey = node.key;
      else if (getParentKey(key, node.children)) parentKey = getParentKey(key, node.children);
    }
  }
  return parentKey;
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
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className="mb-0"
          name={dataIndex}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const LocationUnit = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [editingKey, setEditingKey] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [detail, setDetail] = useState<Item | null>(null);

  const x = 3;
  const y = 2;
  const z = 1;
  const gData: tree[] = [];
  const dataList: tree[] = [];

  function generateData(_level: any, _preKey?: any, _tns?: any) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ title: key, key });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return generateData(level, key, tns[index].children);
    });
  }

  function isEditing(record: Item) {
    return record.key === editingKey;
  }

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
  }

  function generateList(data: tree[]): any {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: key });
      if (node.children) generateList(node.children);
    }
  }

  function onExpand(expandedKeys: any) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }

  function onChange(e: { target: { value: any } }) {
    const expandedKeys = dataList
      .map((item: { title: string | any[]; key: any }) => {
        if (item.title.indexOf(e.target.value) > -1) return getParentKey(item.key, gData);
        return null;
      })
      .filter((item: any, i: any, self: string | any[]) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys);
    setSearchValue(e.target.value);
    setAutoExpandParent(true);
  }

  function loop(data: tree[]): any {
    return data.map((item: tree) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) return { title, key: item.key, children: loop(item.children) };

      return { title, key: item.key };
    });
  }

  generateData(z);

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
        const editable = isEditing(record);
        return (
          <span className="d-flex justify-content-around align-items-center">
            {editable ? (
              <>
                <Button type="text" onClick={() => save(record.key)}>
                  Save
                </Button>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <Button type="text" onClick={() => save(record.key)}>
                    Cancel
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button type="text" onClick={() => edit(record)}>
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
        lastupdated: record.created.toLocaleDateString('en-US'),
        created: record.created.toLocaleDateString('en-US'),
        inputType: col.dataIndex === 'level' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  generateList(dataList);

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Management</h5>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <div>
            <Input.Search
              className="mb-3"
              placeholder="Search"
              size="large"
              prefix={<SearchOutlined />}
              onChange={onChange}
            />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(gData)}
            />
          </div>
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

export { LocationUnit };

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
const ConnectedLocationUnitComponent = connect(mapStateToProps)(LocationUnit);

export default ConnectedLocationUnitComponent;
