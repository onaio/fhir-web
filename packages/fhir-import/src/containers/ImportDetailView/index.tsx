import React from 'react';
import { Spin, Tabs } from 'antd';
import { useQuery } from 'react-query';
import {
  BrokenPage,
} from '@opensrp/react-utils';
import { dataImportRQueryKey, IMPORT_DOMAIN_URI } from '../../constants';
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
 * Details view for a single workflow during bulk uploads.
 *
 * @param props - detail view component props
 */
export const ImportDetailViewDetails = (_: RouteComponentProps) => {
  const params = useParams<RouteComponentProps>();
  const workflowId = params.workflowId;
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery(
    [dataImportRQueryKey, workflowId], () => {
      const service = new OpenSRPService(`/$import`, IMPORT_DOMAIN_URI)
      return service.read(workflowId).then(res => {
        return res
      })
    }, {
    enabled: !!workflowId,
  }
  );


  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={`An Error occurred when fetching this workflow`} />;
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
      <div className='view-details-container'>
        <ResourceDetails
          title={data.workflowType}
          headerLeftData={headerLeftData}
          headerRightData={dateCreatedKeyPairing}
          status={{
            title: data.status,
            color: getStatusColor(data.status)
          }}
          bodyData={() => <KeyValuesDescriptions data={otherDetailsMap} column={2} />}
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
                {data.statusReason?.stdout}
                {data.statusReason?.stderr}
              </pre>
            </div>,
          }]}
        />
      </div>
    </BodyLayout>
  );
};

