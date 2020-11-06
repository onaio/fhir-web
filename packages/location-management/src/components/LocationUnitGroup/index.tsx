/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Input, Row, Col, Menu, Dropdown, Button, Divider, notification } from 'antd';
import { SearchOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import LocationDetail from '../LocationDetail';
import Table, { TableData } from './Table';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchLocationTags,
  getLocationTagsArray,
  LocationTag,
  reducerName,
} from '../../ducks/location-tags';
import { getAccessToken } from '@onaio/session-reducer';
import { Ripple } from '@onaio/loaders';
import { KEYCLOAK_API_BASE_URL, URL_ALL_LOCATION_TAGS } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';

reducerRegistry.register(reducerName, reducer);

export interface LocationUnitGroupProps {
  accessToken: string;
  fetchLocationTags: typeof fetchLocationTags;
  locationsArray: LocationTag[];
}

const defaultProps: LocationUnitGroupProps = {
  accessToken: '',
  fetchLocationTags: fetchLocationTags,
  locationsArray: [],
};

const LocationUnitGroup: React.FC<LocationUnitGroupProps> = (props: LocationUnitGroupProps) => {
  const { fetchLocationTags, locationsArray, accessToken } = props;

  const tableData: TableData[] = [];
  const [form] = Form.useForm();
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState(tableData);
  const [detail, setDetail] = useState<LocationTag | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoading) {
      const clientService = new OpenSRPService(
        accessToken,
        KEYCLOAK_API_BASE_URL,
        URL_ALL_LOCATION_TAGS
      );

      clientService
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationTag[]) => {
          fetchLocationTags(response);
          setIsLoading(false);
        })
        .catch((err: string) => notification.error({ message: `${err}`, description: '' }));
    }
  }, [accessToken, fetchLocationTags, isLoading]);

  useEffect(() => {
    if (locationsArray.length) {
      locationsArray.forEach((location: LocationTag, i: number) => {
        tableData.push({
          key: i.toString(),
          id: location.id,
          name: location.name,
          active: location.active,
          description: location.description,
        });
      });
    }
  }, [locationsArray, tableData]);

  const onChange = (e: { target: { value: string } }) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData);
  };

  if (isLoading) return <Ripple />;

  return (
    <section>
      <Helmet>
        <title>Locations Unit Group</title>
      </Helmet>
      <h5 className="mb-3">Location Unit Group Management</h5>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
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
                accessToken={accessToken}
                data={value.length < 1 ? tableData : filter}
                onViewDetails={(e: TableData) => setDetail(e)}
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

LocationUnitGroup.defaultProps = defaultProps;

// connect to store
const mapStateToProps = (state: Partial<Store>) => {
  const accessToken = getAccessToken(state) as string;
  const locationsArray = getLocationTagsArray(state);
  return { accessToken, locationsArray };
};

// map props to action creators
const mapDispatchToProps = {
  fetchLocationTags: fetchLocationTags,
};

const ConnectedLocationUnitGroup = connect(mapStateToProps, mapDispatchToProps)(LocationUnitGroup);
export { ConnectedLocationUnitGroup };
