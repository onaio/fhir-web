/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Divider, Dropdown, Popconfirm, Tag, Space } from 'antd';
import type { MenuProps } from 'antd';
import { BodyLayout, OpenSRPService } from '@opensrp/react-utils';
import { MoreOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { useHistory, Link } from 'react-router-dom';
import {
  FHIRServiceClass,
  useSimpleTabularView,
  BrokenPage,
  SearchForm,
  TableLayout,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import {
  DATA_IMPORT_LIST_URL,
  DATA_IMPORT_DETAIL_URL,
  DATA_IMPORT_CREATE_URL,
  dataImportRQueryKey,
  IMPORT_DOMAIN_URI
} from '../../constants';
import { ImportDetailViewDetails } from '../ImportDetailOverView';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { RbacCheck, useUserRole } from '@opensrp/rbac';
import { useQuery } from 'react-query';
import { customFetch } from 'opensrp-server-service/dist/types';
import { WorkflowDescription, formatTimestamp } from '../../helpers/utils';
import { SortOrder } from 'antd/es/table/interface';
import { ImportStatusTag } from '../../components/statusTag'


// route params for care team pages
interface RouteParams {
  workflowId: string | undefined;
}

interface Props { }

export type ImportListPropTypes = Props & RouteComponentProps<RouteParams>;




/**
 * Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const DataImportList: React.FC<ImportListPropTypes> = (props: ImportListPropTypes) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { sParams } = useSearchParams()
  const userRole = useUserRole();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;

  const { data, isFetching, isLoading, error } = useQuery(dataImportRQueryKey, () => {
    const service = new OpenSRPService("/$import", IMPORT_DOMAIN_URI)
    return service.list().then(res => {
      return res
    })
  })

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }


  // TODO - add sort
  const columns = [
    {
      title: t('Workflow Id'),
      dataIndex: 'workflowId' as const,
    },
    {
      title: t('Resource upload'),
      dataIndex: 'workflowType' as const,
    },
    {
      title: t('File name'),
      dataIndex: 'filename' as const,
    },
    {
      title: t('status'),
      dataIndex: 'status' as const,
      render: (_: any) => {
        return <ImportStatusTag statusString={_} />
      }
    },
    {
      title: t('Date created'),
      dataIndex: 'dateCreated' as const,
      defaultSortOrder: 'descend' as const,
      sortDirections: ['ascend' as const, 'descend' as const],
      // TODO - figure out ascending / descending order
      sorter: (a: any, b: any) => {
        const diff = a.dateCreated - b.dateCreated
        return diff === 0 ? 0 : diff > 0 ? 1 : -1
      },
      render: (_: any) => formatTimestamp(_),
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: WorkflowDescription) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['WebDataImport.read']}>
          <>
            <Link to={`${DATA_IMPORT_DETAIL_URL}/${record.workflowId.toString()}`} className="m-0 p-1">
              {t('View')}
            </Link>
          </>
          </RbacCheck>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: (data ?? []),
    columns,
    loading: isFetching || isLoading, // TODO - add pagination
  };
  const pageTitle = t('Data imports');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <div />
            <RbacCheck permissions={['WebDataImport.create']}>
            <Link to={DATA_IMPORT_CREATE_URL}>
              <Button type="primary" onClick={() => history.push(DATA_IMPORT_CREATE_URL)}>
                <CloudUploadOutlined />
                {t('Bulk upload')}
              </Button>
            </Link>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        {resourceId && <ImportDetailViewDetails workflowId={resourceId} />}
      </Row>
    </BodyLayout>
  );
};
