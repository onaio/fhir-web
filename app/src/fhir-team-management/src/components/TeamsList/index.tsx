/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { FHIRResponse, reducer, reducerName } from '../../ducks/organizations';
import { TEAMS_GET, TEAM_PRACTITIONERS, URL_ADD_TEAM } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsList.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { Practitioner } from '../../ducks/practitioners';

/** Register reducer */
reducerRegistry.register(reducerName, reducer);
const queryClient = new QueryClient();

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 */
export const loadSingleTeam = async (props: {
  row: TableData;
  fhirbaseURL: string;
  setDetail: (isLoading: TeamsDetailProps | 'loading' | null) => void;
}): Promise<void> => {
  const { fhirbaseURL, row, setDetail } = props;
  const serve = FHIR.client(fhirbaseURL);
  setDetail('loading');
  await serve
    .request(TEAM_PRACTITIONERS + row.id)
    .then((data: Practitioner[]) => setDetail({ ...row, practitioners: data }))
    .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
};

interface Props {
  fhirbaseURL: string;
}

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsList component props
 * @returns {Function} returns team display
 */
const TeamsListComponent: React.FC<Props> = (props: Props) => {
  const { fhirbaseURL } = props;
  const serve = FHIR.client(fhirbaseURL);

  const [detail, setDetail] = useState<TeamsDetailProps | 'loading' | null>(null);
  const [filterData, setfilterData] = useState<{ search?: string; data?: TableData[] }>({});

  const teams = useQuery(TEAMS_GET, () => serve.request(TEAMS_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<IfhirR4.IOrganization>) => res.entry.map((entry) => entry.resource),
  });

  const tableData: TableData[] = useMemo(() => {
    if (teams.data) {
      return teams.data.map((team, i) => {
        const obj: TableData = {
          ...team,
          identifier: team.identifier ? [{ use: 'official', value: team.id }] : undefined,
          resourceType: 'Organization',
          active: team.active ?? false,
          key: i.toString(),
          name: team.name ?? '',
          id: team.name ?? '',
        };
        return obj;
      });
    } else return [];
  }, [teams.data]);

  /**
   * Returns filted list of teams
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
        <title>{lang.TEAMS}</title>
      </Helmet>
      <h5 className="mb-3">{lang.TEAMS}</h5>
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
              <Link to={URL_ADD_TEAM}>
                <Button type="primary">
                  <PlusOutlined />
                  {lang.CREATE_TEAM}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              data={filterData.search && filterData.data?.length ? filterData.data : tableData}
              fhirbaseURL={fhirbaseURL}
              onViewDetails={loadSingleTeam}
              setDetail={setDetail as (isLoading: TeamsDetailProps | 'loading' | null) => void}
            />
          </div>
        </Col>
        {detail ? (
          detail === 'loading' ? (
            <div>Loaduing...</div>
          ) : (
            <Col className="pl-3" span={5}>
              <TeamsDetail onClose={() => setDetail(null)} {...detail} />
            </Col>
          )
        ) : (
          <></>
        )}
      </Row>
    </section>
  );
};

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsList component props
 * @returns {Function} returns team display
 */
export const TeamsList: React.FC<Props> = (props: Props) => (
  <QueryClientProvider client={queryClient}>
    <TeamsListComponent {...props} />
  </QueryClientProvider>
);

export default TeamsList;
