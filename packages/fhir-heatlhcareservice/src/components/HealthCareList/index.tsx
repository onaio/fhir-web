/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import HealthCaresDetail from '../HealthCareDetail';
import { SearchOutlined } from '@ant-design/icons';
import { sendErrorNotification } from '@opensrp/notifications';
import { HealthcareService, HealthcareServiceDetail } from '../../types';
import { HEALTHCARES_GET, URL_ADD_HEALTHCARE } from '../../constants';
import Table from './Table';
import './index.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { loadHealthcareOrganization } from '../../utils';
import { FHIRResponse, FHIRService } from '@opensrp/react-utils';

interface Props {
  fhirBaseURL: string;
}

/** Function which shows the list of all healthcares and there details
 *
 * @param {Object} props - HEALTHCAREsList component props
 * @returns {Function} returns healthcare display
 */
export const HealthCareList: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIRService(fhirBaseURL);

  const [detail, setDetail] = useState<HealthcareServiceDetail | 'loading' | null>(null);
  const [filterData, setfilterData] = useState<{ search?: string; data?: HealthcareService[] }>({});

  const healthcare = useQuery(HEALTHCARES_GET, async () => (await serve).request(HEALTHCARES_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<HealthcareService>) => res.entry.map((e) => e.resource),
  });

  const tableData: HealthcareService[] = useMemo(() => {
    if (healthcare.data) {
      return healthcare.data.map((healthcare, i) => {
        return { ...healthcare, key: i.toString() } as HealthcareService;
      });
    } else return [];
  }, [healthcare.data]);

  /**
   * Returns filted list of healthcares
   *
   * @param {ChangeEvent<HTMLInputElement>} e event recieved onChange
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const filteredData = tableData.filter((row) =>
      row.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData({ search: currentValue, data: filteredData });
  };

  if (!tableData.length) return <Spin size="large" />;

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
              data={filterData.search && filterData.data?.length ? filterData.data : tableData}
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
