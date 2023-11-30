/** Give users option to crete root location if one with configured id is not found. */
import React from 'react';
import { Alert, Button, Card, Col, Popconfirm, Row, Space, Spin, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import { PageHeader, loadAllResources } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { URL_LOCATION_UNIT, locationResourceType } from '../../constants';
import { useHistory } from 'react-router';
import { postPutLocationUnit } from '../LocationForm/utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { useQuery } from 'react-query';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { RbacCheck } from '@opensrp/rbac';
import { Trans } from '@opensrp/i18n';

const { Text } = Typography;

export interface RootLocationWizardProps {
  rootLocationId: string;
  fhirBaseUrl: string;
}

export const RootLocationWizard = (props: RootLocationWizardProps) => {
  const { rootLocationId, fhirBaseUrl } = props;
  const { t } = useTranslation();

  const {
    data: LocationCount,
    error,
    isLoading,
  } = useQuery(
    [locationResourceType],
    () => {
      return loadAllResources(fhirBaseUrl, locationResourceType, { _summary: 'count' });
    },
    {
      select: (res) => res.total,
    }
  );

  const pageTitle = t('Location Unit Management');

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />

      <Row className="list-view">
        <Col className="main-content">
          <Card title={t('Root location was not found')} style={{ minHeight: '60vh' }}>
            <p>
              {t(`Root location with id: {{rootLocationId}} was not found on the server.`, {
                rootLocationId,
              })}
            </p>

            <CardBodyContent
              fetching={isLoading}
              locationNum={LocationCount}
              fhirBaseUrl={fhirBaseUrl}
              rootLocationId={rootLocationId}
              error={error}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
};

interface CardBodyContentProps {
  fetching: boolean;
  locationNum?: number;
  fhirBaseUrl: string;
  rootLocationId: string;
  error?: unknown;
}

const CardBodyContent = ({
  fetching,
  locationNum,
  fhirBaseUrl,
  rootLocationId,
  error,
}: CardBodyContentProps) => {
  const { t } = useTranslation();
  const createRootConfirmProps = {
    fhirBaseUrl,
    rootLocationId,
  };

  if (fetching) {
    return (
      <Trans i18nKey="LookingForUploadedLocations" t={t}>
        <Spin size="small" /> Looking for uploaded locations on the server.
      </Trans>
    );
  } else if (error || locationNum === undefined) {
    return (
      <Space direction="vertical">
        <Alert type="error" message={t('Unable to check if the server has any locations.')} />
        <CreateRootConfirm {...createRootConfirmProps} />
      </Space>
    );
  } else if (locationNum === 0) {
    return (
      <Space direction="vertical">
        <Text>{t('No locations have been uploaded yet.')}</Text>
        <CreateRootConfirm {...createRootConfirmProps} />
      </Space>
    );
  } else {
    return (
      <Space direction="vertical">
        <Trans i18nKey={'locationsOnServer'} t={t} locationNum={locationNum}>
          <Text>There exists {{ locationNum }} locations on the server.</Text>
          <Text> One of these could be the intended but wrongly configured, root location. </Text>
          <Text> If you are not sure, kindly reach out to the web administrator for help.</Text>
        </Trans>
        <CreateRootConfirm {...createRootConfirmProps} />
      </Space>
    );
  }
};

interface CreateRootConfirmProps {
  fhirBaseUrl: string;
  rootLocationId: string;
}

const CreateRootConfirm = (props: CreateRootConfirmProps) => {
  const { fhirBaseUrl, rootLocationId } = props;
  const history = useHistory();
  const { t } = useTranslation();

  const onOk = () => history.push(URL_LOCATION_UNIT);

  const rootLocationPayload = {
    ...rootLocationTemplate,
    id: rootLocationId,
    identifier: [
      {
        use: 'official',
        value: rootLocationId,
      },
    ],
  } as ILocation;

  return (
    <RbacCheck
      permissions={['Location.create']}
      fallback={<Text type="warning">Missing required permissions to create locations</Text>}
    >
      <Popconfirm
        title={t(
          `This action will create a new location with id {{rootLocationId}}. The web application will then use the created location as the root location.`,
          { rootLocationId }
        )}
        okText={t('Proceed')}
        cancelText={t('Cancel')}
        onConfirm={async () => {
          await postPutLocationUnit(rootLocationPayload, fhirBaseUrl)
            .then(() => {
              sendSuccessNotification(t('Root location uploaded to the server.'));
              onOk();
            })
            .catch(() => {
              sendErrorNotification(
                t('Could not upload the root location at this time, please try again later.')
              );
            });
        }}
      >
        <Button type="primary">{t('Create root location.')}</Button>
      </Popconfirm>
    </RbacCheck>
  );
};

const rootLocationTemplate = {
  resourceType: 'Location',
  status: 'active',
  name: 'Root FHIR Location',
  alias: ['Root Location'],
  description:
    'This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.',
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
};
