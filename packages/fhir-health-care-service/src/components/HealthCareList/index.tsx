/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import HealthCaresDetail from '../HealthCareDetail';
import { SearchOutlined } from '@ant-design/icons';
import { sendErrorNotification } from '@opensrp/notifications';
import { HealthcareService, HealthcareServiceDetail } from '../../types';
import {
  HEALTH_CARE_SERVICE_ENDPOINT,
  HEALTH_CARE_SERVICE_RESOURCE_TYPE,
  URL_ADD_HEALTHCARE,
} from '../../constants';
import Table from './Table';
import './index.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { loadHealthcareOrganization } from '../../utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { getConfig } from '@opensrp/pkg-config';

interface Props {
  resourcePageSize?: number;
}

/** Function which shows the list of all healthcares and there details
 *
 * @param {Object} props - HEALTHCAREsList component props
 * @returns {Function} returns healthcare display
 */
export const HealthCareList: React.FC<Props> = (props: Props) => {
  const { resourcePageSize = 20 } = props;
  const fhirParams = {
    _count: resourcePageSize,
    _getpagesoffset: 0,
  };

  const fhirBaseURL = getConfig('fhirBaseURL') ?? '';

  const serve = new FHIRServiceClass<HealthcareService>(
    fhirBaseURL,
    HEALTH_CARE_SERVICE_RESOURCE_TYPE
  );

  const [detail, setDetail] = useState<HealthcareServiceDetail | 'loading' | null>(null);
  const [filterData, setfilterData] = useState<{ search?: string; data?: HealthcareService[] }>({});

  const healthcare = useQuery(HEALTH_CARE_SERVICE_ENDPOINT, async () => serve.list(fhirParams), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res.entry.map((e) => e.resource),
  });

  /**
   * Returns filted list of healthcares
   *
   * @param {ChangeEvent<HTMLInputElement>} e event recieved onChange
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const filteredData = healthcare.data?.filter((row) =>
      row.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData({ search: currentValue, data: filteredData });
  };

  if (!healthcare.data?.length) return <Spin size="large" />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.HEALTHCARES}</title>
      </Helmet>
      <h5 className="mb-3">{lang.HEALTHCARES}</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder={lang.SEARCH}
                size="large"
                defaultValue={filterData.search}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </h5>
            <div>
              <Link to={URL_ADD_HEALTHCARE}>
                <Button type="primary">
                  <PlusOutlined />
                  {lang.CREATE_HEALTHCARE}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              data={
                filterData.search && filterData.data?.length ? filterData.data : healthcare.data
              }
              onViewDetails={(datum) => {
                setDetail('loading');
                loadHealthcareOrganization(fhirBaseURL, datum)
                  .then((healthcare) => setDetail(healthcare))
                  .catch(() => {
                    sendErrorNotification(lang.ERROR_OCCURRED);
                    setDetail(null);
                  });
              }}
            />
          </div>
        </Col>
        {detail ? (
          detail === 'loading' ? (
            <Spin size="large" style={{ flexGrow: 1, width: 'auto', height: 'auto' }} />
          ) : (
            <Col className="pl-3" span={5}>
              <HealthCaresDetail onClose={() => setDetail(null)} {...detail} />
            </Col>
          )
        ) : (
          <></>
        )}
      </Row>
    </section>
  );
};

export default HealthCareList;
