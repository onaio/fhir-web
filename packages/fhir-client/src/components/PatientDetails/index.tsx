/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Col, Row, Menu, Badge, Card, Avatar, Tag, Spin, Layout, Alert } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, useParams } from 'react-router-dom';
import FHIR from 'fhirclient';
import get from 'lodash/get';
import { BrokenPage, handleSessionOrTokenExpiry } from '@opensrp/react-utils';
import { fhirclient } from 'fhirclient/lib/types';
import { getPatientName } from '../PatientsList/utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { DocumentReferenceDetails } from '../DocumentReference';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { patientResourceType } from '../../constants';
import { useQuery } from 'react-query';
import { resourcesSchema } from './ResourceSchema';
import { PatientDetailsTable } from '../..//helpers/utils';
import { useTranslation } from '../../mls';

const { Header, Sider, Content } = Layout;

// Interface for route params
interface RouteParams {
  id: string;
}

// Interface for resourceTypeMap
interface ResourceTypeMap {
  [key: string]: { count: number; data: fhirclient.FHIR.Resource[] };
}

/** props for editing a user view */
export interface PatientDetailProps {
  fhirBaseURL: string;
  patientBundleSize: number;
}

/** type intersection for all types that pertain to the props */
export type PatientDetailPropTypes = PatientDetailProps & RouteComponentProps<RouteParams>;

/** default props for editing patient component */
export const defaultEditPatientProps: PatientDetailProps = {
  fhirBaseURL: '',
  patientBundleSize: 1000,
};

/**
 * Component which shows FHIR resource details of a single patient
 *
 * @param {Object} props - PatientDetails component props
 * @returns {React.FC} returns patient resources display
 */
const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL, patientBundleSize } = props;
  const { id: patientId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const [resourceType, setResourceType] = React.useState<string>(patientResourceType);
  const { error, data, isLoading } = useQuery([patientResourceType, patientId], async () => {
    const token = await handleSessionOrTokenExpiry();
    return await FHIR.client(fhirBaseURL).request({
      url: `Patient/${patientId}/$everything?_count=${patientBundleSize}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error) {
    return <BrokenPage errorMessage={t('An error occurred')} />;
  }

  const resourceTypeMap: ResourceTypeMap = {};

  if (data && data.entry?.length) {
    for (const datum of data.entry) {
      const resourceTypeStr = datum.resource.resourceType as string;
      if (!resourceTypeMap[resourceTypeStr]) {
        resourceTypeMap[resourceTypeStr] = {
          count: 1,
          data: [datum.resource],
        };
      } else {
        const resourceCount = resourceTypeMap[resourceTypeStr].count + 1;
        resourceTypeMap[resourceTypeStr] = {
          count: resourceCount,
          data: [...(resourceTypeMap[resourceTypeStr]?.data ?? []), datum.resource],
        };
      }
    }
  }

  const resources = resourceTypeMap[resourceType]?.data;
  const { columns: columnsFactory, resourceParser } = resourcesSchema[resourceType] ?? {};
  const columns = columnsFactory?.(t);

  const patientName = getPatientName(resourceTypeMap['Patient'].data[0] as IPatient);
  const currentPatient = resourceTypeMap['Patient'].data[0];
  const { gender, birthDate } = currentPatient;
  const avatarLink = `https://www.gravatar.com/avatar/${patientId}?s=50&r=any&default=identicon&forcedefault=1`;
  return (
    <Row id="patient-details">
      <Col span={24}>
        <section className="content-section">
          <Helmet>
            <title>{t('Patient Details')}</title>
          </Helmet>
          <div className="plan-avatar-detail-section">
            <Layout className="patient-details-banner">
              <Sider>
                <Avatar src={avatarLink} className="patient-details-banner_avatar" />
              </Sider>
              <Layout>
                <Header>
                  <h4>
                    {patientName}{' '}
                    {currentPatient.deceasedBoolean || currentPatient.deceasedDateTime ? (
                      <Tag color="red">{t('Deceased')}</Tag>
                    ) : null}
                  </h4>
                </Header>
                <Content>
                  {(() => {
                    const columnarData = [
                      {
                        [t('UUID')]: get(currentPatient, 'identifier.0.value'),
                        [t('ID')]: patientId,
                        [t('Gender')]: gender,
                      },
                      {
                        [t('Birth Date')]: birthDate,
                        [t('Phone')]: get(currentPatient, 'telecom.0.value'),
                        [t('MRN')]: 'Unknown',
                      },
                      {
                        [t('Address')]: get(currentPatient, 'address.0.line.0') || 'N/A',
                        [t('Country')]: get(currentPatient, 'address.0.country'),
                      },
                    ];
                    return (
                      <div className="patient-details__box">
                        {columnarData.map((columnData, idx) => {
                          return (
                            <div className="patient-detail-section" key={idx}>
                              {Object.entries(columnData).map(([key, value]) => {
                                return (
                                  <div key={key} className="patient-detail__key-value">
                                    <span>{key}: </span>
                                    <span>{value}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </Content>
              </Layout>
            </Layout>
          </div>
          <Row>
            <Col span={6}>
              <Menu
                mode="vertical"
                style={{ width: 'auto' }}
                defaultSelectedKeys={[resourceType]}
                selectedKeys={[resourceType]}
              >
                {Object.keys(resourceTypeMap).map((type: string) => (
                  <Menu.Item
                    key={type}
                    id={type}
                    onClick={(e) => {
                      setResourceType(e.key as string);
                    }}
                  >
                    {type}{' '}
                    <Badge
                      count={resourceTypeMap[type].count}
                      overflowCount={500}
                      style={{ backgroundColor: '#777', float: 'right', marginTop: '10px' }}
                    />
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col span={18}>
              <Card
                title={
                  <>
                    <span style={{ color: '#1890ff' }}>
                      <IdcardOutlined  /> {resourceType}
                    </span>
                  </>
                }
                bordered={false}
              >
                {(() => {
                  if (resourceType === 'DocumentReference') {
                    return (
                      <DocumentReferenceDetails
                        fhirBaseApiUrl={fhirBaseURL}
                        documentResources={
                          resourceTypeMap[resourceType].data as IfhirR4.IDocumentReference[]
                        }
                      />
                    );
                  } else {
                    if (!columns || !resourceParser) {
                      return <Alert message={t('Work in progress')} type="info" />;
                    }
                    return (
                      <PatientDetailsTable
                        columns={columns}
                        resources={resources}
                        parseResource={resourceParser}
                      />
                    );
                  }
                })()}
              </Card>
            </Col>
          </Row>
        </section>
      </Col>
    </Row>
  );
};

PatientDetails.defaultProps = defaultEditPatientProps;

export { PatientDetails };
