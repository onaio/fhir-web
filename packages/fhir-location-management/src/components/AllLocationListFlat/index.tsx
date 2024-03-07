import React, { useEffect, useState } from 'react';
import { useSimpleTabularView, NoData } from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import {
  locationResourceType,
  URL_LOCATION_UNIT_EDIT,
  URL_LOCATION_UNIT_ADD,
} from '../../constants';
import { BrokenPage, TableLayout, PageHeader, SearchForm } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../../mls';
import { Row, Col, Button, Divider, Dropdown } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { RbacCheck } from '@opensrp/rbac';
import type { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { getEntryFromBundle, getTableData } from './utils';

interface RouteParams {
  locationId: string | undefined;
}

export interface Props {
  fhirBaseURL: string;
}

const getSearchParams = (search: string | null) => {
  const baseSearchParam = { _include: 'Location:partof' };
  if (search) {
    return { 'name:contains': search, ...baseSearchParam };
  }
  return baseSearchParam;
};

export type LocationListPropTypes = Props & RouteComponentProps<RouteParams>;

/* Function which shows the list of all locations
 *
 * @param {Object} props - AllLocationListFlat component props
 * @returns {Function} returns paginated locations list display
 */
export const AllLocationListFlat: React.FC<LocationListPropTypes> = (props) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [_, setDetailId] = useState<string>();
  const [tableData, setTableData] = useState<Dictionary<string>[]>([]);

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<BundleEntry>(
    fhirBaseURL,
    locationResourceType,
    getSearchParams,
    getEntryFromBundle
  );

  useEffect(() => {
    const updatedTableData = getTableData(data?.records ?? []);
    setTableData(updatedTableData);
  }, [data]);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  type TableData = typeof tableData[0];

  const getItems = (record: TableData): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: (
          <Button disabled type="link" onClick={() => setDetailId(record.id)}>
            {t('View details')}
          </Button>
        ),
      },
    ];
  };

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      editable: true,
    },
    {
      title: t('Type'),
      dataIndex: 'type' as const,
      editable: true,
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
      editable: true,
    },
    {
      title: t('Parent'),
      dataIndex: 'parent' as const,
      editable: true,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Location.update']}>
            <>
              <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id.toString()}`} className="m-0 p-1">
                {t('Edit')}
              </Link>
              <Divider type="vertical" />
            </>
          </RbacCheck>
          <Dropdown
            menu={{ items: getItems(record) }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" data-testid="action-dropdown" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const AddLocationBtn = () => (
    <Button type="primary" onClick={() => history.push(URL_LOCATION_UNIT_ADD)}>
      <PlusOutlined />
      {t('Add Location')}
    </Button>
  );

  const getTableLocale = () => {
    const urlQuery = history.location.search;
    const nameSearchActive = urlQuery.includes('search=');
    if (!tableData.length && (!isFetching || !isLoading)) {
      const description = nameSearchActive
        ? ''
        : t('No data available to display, you can start adding data now ');
      return {
        emptyText: (
          <NoData description={description}>{!nameSearchActive && <AddLocationBtn />}</NoData>
        ),
      };
    }
  };

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
    locale: getTableLocale(),
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{t('All Locations List')}</title>
      </Helmet>
      <PageHeader title={t('All Locations')} />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <RbacCheck permissions={['Location.create']}>
              <Link to={URL_LOCATION_UNIT_ADD}>
                <AddLocationBtn />
              </Link>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};
