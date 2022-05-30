/* eslint-disable @typescript-eslint/naming-convention */
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
import { useTranslation } from '../../mls';
import Table from './Table';
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
  const [filter, setfilterData] = useState<LocationUnitGroup[] | null>(null);
  const { opensrpBaseURL } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, opensrpBaseURL);
      serve
        .list({ is_jurisdiction: true, serverVersion: 0 })
        .then((response: LocationUnitGroup[]) => {
          dispatch(fetchLocationUnitGroups(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification(t('An error occurred')));
    }
  });

  const tableData: LocationUnitGroup[] = locationsArray;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as LocationUnitGroup[]);
  };

  if (isLoading) return <Spin className="custom-spinner" size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{t('Location Unit Group')}</title>
      </Helmet>
      <h1 className="mb-3 fs-5">{t('Location Unit Group Management')}</h1>
      <Row>
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between p-3">
            <Input
              className="w-auto"
              placeholder={t('Search')}
              size="large"
              value={value}
              prefix={<SearchOutlined />}
              onChange={onChange}
            />
            <div>
              <Link to={URL_LOCATION_UNIT_GROUP_ADD}>
                <Button type="primary">
                  <PlusOutlined />
                  {t('Add Location Unit Group')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3">
            <Table
              opensrpBaseURL={opensrpBaseURL}
              data={value.length < 1 ? tableData : (filter as LocationUnitGroup[])}
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
