import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router';
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
  Divider,
  notification,
} from 'antd';
import { MoreOutlined, SearchOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import { Store } from 'redux';
import { getAccessToken } from '@onaio/session-reducer';
import { Ripple } from '@onaio/loaders';
import { connect } from 'react-redux';
import '../Location.css';
import LocationDetail from '../LocationDetail';
import { URL_ALL_LOCATION_TAGS, KEYCLOAK_API_BASE_URL,URL_DELETE_LOCATION_TAGS } from '../../constants';
export interface GetLocationProps {
  accessToken: string;
}
export interface RouteParams {
  userId: string;
}
/** type intersection for all types that pertain to the props */
export type PropsTypes = GetLocationProps & RouteComponentProps<RouteParams>;
interface Item {
  key: string;
  name: string;
  active: any;
  type: string;
  created: Date;
  lastupdated: Date;
  externalid: string;
  openmrsid: string;
  username: string;
  version: string;
  syncstatus: 'Synced' | 'Not Synced';
  level: number;
  description : string
}
const tableData: Item[] = [];
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({ ...props }) => {
  const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;
  return (
    <td {...restProps}>
      {children}
    </td>
  );
};
const LocationUnitGroup: React.FC<PropsTypes> = (props: PropsTypes) => {
  const { accessToken } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [filter, setfilterData] = useState(tableData);
  const [value, setValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const clientService = new OpenSRPService(accessToken, KEYCLOAK_API_BASE_URL, URL_ALL_LOCATION_TAGS);
    clientService
      .list()
      .then((res) => {
        setData(res)
        setfilterData(res)
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        notification.error({
          message: `${err}`,
          description: '',
        });
      });
  }, []);

  const edit = () => {
  };

  const onRemoveHandler = (record: any) =>{
  
    const clientService = new OpenSRPService(accessToken, KEYCLOAK_API_BASE_URL, URL_DELETE_LOCATION_TAGS + `/${record.id}` );
    clientService
      .delete()
      .then((res) => { 
        setIsLoading(false);
        notification.success({
          message: 'Successfully Deleted!',
          description: '',
        });
      })
      .catch((err) => {
        setIsLoading(false);
        notification.error({
          message: `${err}`,
          description: '',
        });
      });
  }

  const onViewDetail = (record: any) =>{
  
    const clientService = new OpenSRPService(accessToken,  KEYCLOAK_API_BASE_URL, URL_ALL_LOCATION_TAGS + `/${record.id}` );
    clientService
      .list()
      .then((res) => { 
        setIsLoading(false);
        console.log(res)
        setSelectedLocation(res);
       
      })
      .catch((err) => {
        setIsLoading(false);
        notification.error({
          message: `${err}`,
          description: '',
        });
      });
  }




  
  const cancel = () =>{};

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: Item) => 
       
          <span className="location-table-action">
            <p className="edit" onClick={() => edit()}>
              Edit
            </p>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                     onClick={() => {
                      onViewDetail(record);
                     }}
                  >
                    View Details
                  </Menu.Item>
                  {/* <Menu.Item>
                    <Popconfirm title="Sure to Delete?" onConfirm={() => onRemoveHandler(record)}>
                      Delete
                    </Popconfirm>
                  </Menu.Item> */}
                </Menu>
              }
              placement="bottomLeft"
              arrow
              trigger={['click']}
            >
              <MoreOutlined className="more-options" />
            </Dropdown>
          </span>
      
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'level' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        // editing: isEditing(),
      }),
    };
  });

  const onChange = (e: { target: { value: any } }) => {

    const currentValue = e.target.value;    
    setValue(currentValue);
    
    console.log('currentValue', currentValue,length)
    console.log('setData', data)
    const filteredData = data.filter((entry) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
     setfilterData(filteredData);
  
  };


  if (isLoading) {
    return <Ripple />;
  }

  return (
    <section>
      <Helmet>
        <title>Locations Unit</title>
      </Helmet>
      <Row justify="start" className="weclome-box">
        <Col span={24}>
          <h5>Location Unit Group Management</h5>
        </Col>
      </Row>
      <Row>
        <Col span={selectedLocation !== null ? 16 : 24}>
          <Row className="bg-white">
            <Col span={24}>
              <div className="mb-3 mt-3 mr-1 ml-3 d-flex justify-content-between">
                <h5>
                  <Input
                    placeholder="Search"
                    size="large"
                    value={value}
                    prefix={<SearchOutlined />}
                    onChange={onChange}
                  />
                </h5>
                <div>
                  <Button type="primary">
                    <PlusOutlined />
                    Add location unit group
                  </Button>
                  <Divider type="vertical" />
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key={'1'}>Logout</Menu.Item>
                      </Menu>
                    }
                    placement="bottomRight"
                  >
                    <Button shape="circle" icon={<SettingOutlined />} type="text" />
                  </Dropdown>
                </div>
              </div>
              <div className="table-container">
                <Form form={form} component={false}>
                  <Table
                    components={{ body: { cell: EditableCell } }}
                    dataSource={ value.length < 1 ? data : filter}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel, showQuickJumper: true }}
                  />
                </Form>
              </div>
            </Col>
          </Row>
        </Col>
        {selectedLocation !== null ? (
          <Col className="pl-3 border-left" span={8}>
            <LocationDetail onClose={() => setSelectedLocation(null)} {...selectedLocation} />
          </Col>
        ) : null}
      </Row>
    </section>
  );
};

interface DispatchedProps {
  accessToken: string;
}
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const accessToken = getAccessToken(state) as string;
  return { accessToken };
};

export const ConnectedLocationUnitGroupAdd = connect(mapStateToProps, null)(LocationUnitGroup);
