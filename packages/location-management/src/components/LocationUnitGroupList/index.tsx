/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LocationUnitGroupDetail, { LocationUnitGroupDetailProps } from '../LocationUnitGroupDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchLocationUnitGroups,
  getLocationUnitGroupsArray,
  LocationUnitGroup,
  reducerName,
} from '../../ducks/location-unit-groups';
import { LOCATION_UNIT_GROUP_ALL, URL_LOCATION_UNIT_GROUP_ADD } from '../../constants';
import lang from '../../lang';
import Table, { TableData } from './Table';
import './LocationUnitGroupList.css';
import { Link } from 'react-router-dom';
import { sendErrorNotification } from '@opensrp/notifications';
import { Props } from '../../helpers/common';

reducerRegistry.register(reducerName, reducer);

const LocationUnitGroupList: React.FC<Props> = (props: Props) => {
  const locationsArray = useSelector((state) => getLocationUnitGroupsArray(state));
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<LocationUnitGroupDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, opensrpBaseURL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationUnitGroup[]) => {
          dispatch(fetchLocationUnitGroups(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
    }
  });

  const tableData: TableData[] = [];

  if (locationsArray.length) {
    locationsArray.forEach((location: LocationUnitGroup, i: number) => {
      tableData.push({
        key: i.toString(),
        id: location.id,
        name: location.name,
        active: location.active,
        description: location.description,
      });
    });
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as TableData[]);
  };

  if (isLoading)
    return (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
        size={'large'}
      />
    );

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.LOCATION_UNIT_GROUP}</title>
      </Helmet>
      <h5 className="mb-3">{lang.LOCATION_UNIT_GROUP_MANAGEMENT}</h5>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <h5>
              <Input
                placeholder={lang.SEARCH}
                size="large"
                value={value}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </h5>
            <div>
              <Link to={URL_LOCATION_UNIT_GROUP_ADD}>
                <Button type="primary">
                  <PlusOutlined />
                  {lang.ADD_LOCATION_UNIT_GROUP}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3">
            <Table
              opensrpBaseURL={opensrpBaseURL}
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={(e: LocationUnitGroupDetailProps) => setDetail(e)}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <LocationUnitGroupDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};
export default LocationUnitGroupList;
