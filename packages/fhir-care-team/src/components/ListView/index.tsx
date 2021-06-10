/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Table, Spin, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import FHIR from 'fhirclient';
import { sendErrorNotification } from '@opensrp/notifications';
import { useQuery } from 'react-query';
import { createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import lang from '../../lang';
import { SEARCH_QUERY_PARAM, FHIR_CARE_TEAM, URL_EDIT_CARE_TEAM } from '../../constants';

// Define selector instance

interface TableData {
  key: number | string;
  id: string;
  name: string;
}

interface Props {
  fhirBaseURL: string;
}

/** default component props */
const defaultProps = {
  fhirBaseURL: '',
};

/** Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const CareTeamList: React.FC<Props & RouteComponentProps> = (
  props: Props & RouteComponentProps
) => {
  const { fhirBaseURL } = props;

  const { data, isLoading } = useQuery(
    FHIR_CARE_TEAM,
    () => FHIR.client(fhirBaseURL).request(FHIR_CARE_TEAM),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: any) => res,
    }
  );

  if (isLoading && !data) return <Spin size="large" />;

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const tableData: TableData[] = data.entry?.map((datum: any, index: number) => {
    return {
      key: `${index}`,
      id: datum.resource.id,
      name: datum.resource.name,
    };
  });

  const columns = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={URL_EDIT_CARE_TEAM + record.id.toString()}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item className="viewdetails" onClick={() => {}}>
                  View Details
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <div className="content-section">
      <Helmet>
        <title>{lang.CARE_TEAM_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={lang.CARE_TEAM_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
          </div>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

CareTeamList.defaultProps = defaultProps;

export default CareTeamList;
