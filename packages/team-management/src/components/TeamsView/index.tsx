/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  reducer,
  fetchOrganizationsAction,
  getOrganizationsArray,
  Organization,
  reducerName,
} from '../../ducks/organizations';
import { TEAMS_GET, TEAM_PRACTITIONERS, URL_ADD_TEAM } from '../../constants';
import Table from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Practitioner } from '../../ducks/practitioners';
import lang, { Lang } from '../../lang';

/** Register reducer */
reducerRegistry.register(reducerName, reducer);

/**
 * Function to load selected Team for details
 *
 * @param {Organization} row data selected from the table
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail funtion to set detail to state
 * @param {Function} setPractitionersList funtion to set detail to state
 * @param {Lang} langObj - the translation object lookup
 */
export const loadSingleTeam = (
  row: Organization,
  opensrpBaseURL: string,
  setDetail: (isLoading: string | Organization) => void,
  setPractitionersList: (isLoading: string | Practitioner[]) => void,
  langObj: Lang = lang
): void => {
  const serve = new OpenSRPService(TEAM_PRACTITIONERS + row.identifier, opensrpBaseURL);
  serve
    .list()
    .then((response: Practitioner[]) => {
      setPractitionersList(response);
      setDetail(row);
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURRED));
};

interface Props {
  opensrpBaseURL: string;
}

/** default component props */
const defaultProps = {
  opensrpBaseURL: '',
};

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsView component props
 * @returns {Function} returns team display
 */
export const TeamsView: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const [detail, setDetail] = useState<TeamsDetailProps | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<Organization[] | null>(null);
  const { opensrpBaseURL } = props;
  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(TEAMS_GET, opensrpBaseURL);
      serve
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
    }
  });

  /**
   * Returns filted list of teams
   *
   * @param {object} e event recieved onChange
   * @param {object} e.target -
   * @param {object} e.target.value value to be filtered from tabel list
   */
  const onChange = (e: { target: { value: string } }) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = teamsArray.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as Organization[]);
  };

  if (isLoading) return <Spin size="large" />;

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
                value={value}
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
              data={value.length < 1 ? teamsArray : (filter as Organization[])}
              onViewDetails={loadSingleTeam}
              opensrpBaseURL={opensrpBaseURL}
              setPractitionersList={
                setPractitionersList as (isLoading: string | Practitioner[]) => void
              }
              setDetail={setDetail as (isLoading: string | Organization) => void}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <TeamsDetail
              onClose={() => setDetail(null)}
              {...detail}
              teamMembers={practitionersList}
            />
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};

TeamsView.defaultProps = defaultProps;

export default TeamsView;
