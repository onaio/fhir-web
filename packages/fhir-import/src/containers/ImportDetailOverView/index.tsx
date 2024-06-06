import React, { Fragment } from 'react';
import { Col, Button, Alert, Spin, Tabs } from 'antd';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import {
  BrokenPage,
  FHIRServiceClass,
  getObjLike,
  IdentifierUseCodes,
  getResourcesFromBundle,
  parseFhirHumanName,
  viewDetailsQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import { dataImportRQueryKey } from '../../constants';
import { useTranslation } from '../../mls';
import { OpenSRPService, BodyLayout, ResourceDetails, Resource404, KeyValuesDescriptions } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { formatTimestamp } from '../../helpers/utils'
import { getStatusColor } from '../../components/statusTag'
import "./index.css";

/** typings for the view details component */
export interface RouteComponentProps {
  workflowId: string;
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ImportDetailViewDetails = (props: RouteComponentProps) => {
  const params = useParams<RouteComponentProps>();
  const workflowId = params.workflowId;
  const { t } = useTranslation();
  const { removeParam } = useSearchParams();
  console.log("We got here", { workflowId })

  const { data, isLoading, error } = useQuery(
    [dataImportRQueryKey, workflowId], () => {
      const service = new OpenSRPService(`/$import`, "http://localhost:3001")
      return service.read(workflowId).then(res => {
        console.log({ res }); return res
      })
    }, {
    enabled: !!workflowId,
  }
  );


  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={`${(error as Error).message}`} />;
  }

  if (!data) {
    return <Resource404 />;
  }

  const pageTitle = t(`View details | {{workflowId}}`, { workflowId: data.workflowId });
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };


  const dateCreatedKeyPairing = {
    [t('Date Created')]: formatTimestamp(data.dateCreated),
  };

  const headerLeftData = {
    ID: data.workflowId,
  };

  const otherDetailsMap = {
    [t('Workflow type')]: data.workflowType,
    [t('Date Started')]: formatTimestamp(data.dateStarted),
    [t('Date Ended')]: formatTimestamp(data.dateEnded),
    [t('Author')]: data.author
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle} </title>
      </Helmet>
      <div
        // TODO remove style
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '16px',
          gap: '14px',
          background: '#FFF',
          borderRadius: '12px',
        }}
      >
        <ResourceDetails
          title={data.workflowType}
          headerLeftData={headerLeftData}
          headerRightData={dateCreatedKeyPairing}
          status={{
            title: data.status,
            color: getStatusColor(data.status)
          }}
          bodyData={() => <KeyValuesDescriptions data={ResourceDetails} column={2} />}
        />
        <Tabs
          data-testid="details-tab"
          style={{ width: '100%' }}
          size={'small'}
          items={[{
            label: t('Log Output'),
            key: "logOutput",
            children: <div className="terminal-output">
              <pre>
                {data.statusReason.stdout}
                {data.statusReason.stderr}
              </pre>
            </div>,
          }]}
        />
      </div>
    </BodyLayout>
  );
};

