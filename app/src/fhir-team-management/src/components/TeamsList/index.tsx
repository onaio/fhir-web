/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { sendErrorNotification } from '@opensrp/notifications';
import { FHIRResponse, Practitioner, PractitionerRole, Organization } from '../../types';
import { TEAMS_GET, PRACTITIONER_GET, URL_ADD_TEAM, PRACTITIONERROLE_GET } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsList.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { useQuery } from 'react-query';
import FHIR from 'fhirclient';

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadSingleTeam(props: {
  team: TableData;
  fhirbaseURL: string;
  setDetail: (isLoading: TeamsDetailProps | 'loading' | null) => void;
}): Promise<void> {
  const { fhirbaseURL, team, setDetail } = props;
  const serve = FHIR.client(fhirbaseURL);
  setDetail('loading');

  const allPractitioner = await serve
    .request(PRACTITIONER_GET)
    .then((res: FHIRResponse<Practitioner>) => res.entry.map((entry) => entry.resource));
  const AllRoles = await serve
    .request(PRACTITIONERROLE_GET)
    .then((res: FHIRResponse<PractitionerRole>) => res.entry.map((entry) => entry.resource));

  const practitionerRolesAssigned = AllRoles.filter(
    (role) => role.organization.identifier?.value === team.identifier[0].value
  ).map((role) => role.practitioner.identifier?.value);
  const practitionerAssigned = allPractitioner.filter((prac) =>
    practitionerRolesAssigned.includes(prac.identifier[0].value)
  );

  setDetail({ ...team, practitioners: practitionerAssigned });
}

interface Props {
  fhirbaseURL: string;
}

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsList component props
 * @returns {Function} returns team display
 */
export const TeamsList: React.FC<Props> = (props: Props) => {
  const { fhirbaseURL } = props;
  const serve = FHIR.client(fhirbaseURL);

  const [detail, setDetail] = useState<TeamsDetailProps | 'loading' | null>(null);
  const [filterData, setfilterData] = useState<{ search?: string; data?: TableData[] }>({});

  const teams = useQuery(TEAMS_GET, () => serve.request(TEAMS_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<Organization>) => res.entry.map((entry) => entry.resource),
  });

  const tableData: TableData[] = useMemo(() => {
    if (teams.data) {
      return teams.data.map((team, i) => {
        const obj: TableData = {
          ...team,
          resourceType: 'Organization',
          active: team.active ?? false,
          key: i.toString(),
          name: team.name ?? '',
          id: team.id ?? '',
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
              onViewDetails={(prams) =>
                loadSingleTeam(prams).catch(() => {
                  sendErrorNotification(lang.ERROR_OCCURRED);
                  setDetail(null);
                })
              }
              setDetail={setDetail as (isLoading: TeamsDetailProps | 'loading' | null) => void}
            />
          </div>
        </Col>
        {detail ? (
          detail === 'loading' ? (
            <Spin size="large" style={{ flexGrow: 1, width: 'auto', height: 'auto' }} />
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

export default TeamsList;
