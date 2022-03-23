import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { parseGroup, ViewDetailsWrapper } from '../GroupDetail';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Group } from '../../types';
import { groupResourceType, ADD_EDIT_GROUP_URL, LIST_GROUP_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { SearchForm, BrokenPage, TableLayout, useSimpleTabularView } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

interface GroupListProps {
  fhirBaseURL: string;
}

interface RouteParams {
  id?: string;
}

/** 
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const GroupList = (props: GroupListProps) => {
  const { fhirBaseURL } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { searchFormProps, tablePaginationProps, queryValues } =
    useSimpleTabularView<Group>(fhirBaseURL, groupResourceType);
  const { data, isFetching, isLoading, error } = queryValues;


  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((org: IGroup, index: number) => {
    return {
      ...parseGroup(org),
      key: `${index}`,
    };
  });
  type TableData = typeof tableData[0];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: 'Active',
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated' as const,
      key: 'lastUpdated' as const,
    },
    {
      title: 'Actions',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${ADD_EDIT_GROUP_URL}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item key="view-details" className="view-details">
                  <Link to={`${LIST_GROUP_URL}/${record.id}`}>View Details</Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (<div className="content-section">
    <Helmet>
      <title>Groups list</title>
    </Helmet>
    <PageHeader title={'Groups list'} className="page-header" />
    <Row className="list-view">
      <Col className="main-content">
        <div className="main-content__header">
          <SearchForm data-testid="search-form" {...searchFormProps} />
          <Link to={ADD_EDIT_GROUP_URL}>
            <Button type="primary">
              <PlusOutlined />
              Create Group
            </Button>
          </Link>
        </div>
        <TableLayout {...tableProps} />
      </Col>
      <ViewDetailsWrapper resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
    </Row>
  </div>)
};
