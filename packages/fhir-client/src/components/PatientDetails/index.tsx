/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Col, Row, Menu, Badge, Table, Card, Avatar, Tag, Spin, Layout } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FHIR from 'fhirclient';
import get from 'lodash/get';
import { BrokenPage, handleSessionOrTokenExpiry } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { fhirclient } from 'fhirclient/lib/types';
import { getPatientName, getPath, buildObservationValueString } from '../PatientsList/utils';
import { resourcesSchema } from '../PatientsList/resourcesSchema';
import { Dictionary } from '@onaio/utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { DocumentReferenceDetails } from '../DocumentReference';

const { Header, Sider, Content } = Layout;

const queryClient = new QueryClient();

// Interface for route params
interface RouteParams {
  patientId: string;
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

/** Component which shows FHIR resource details of a single patient
 *
 * @param {Object} props - PatientDetails component props
 * @returns {React.FC} returns patient resources display
 */
const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL, patientBundleSize } = props;
  const [resourceType, setResourceType] = React.useState<string>('Patient');
  const patientId = props.match.params['patientId'];
  const { error, data, isLoading } = useQuery('fetchPatient', async () => {
    const token = await handleSessionOrTokenExpiry();
    return await FHIR.client(fhirBaseURL)
      .request({
        url: `Patient/${patientId}/$everything?_count=${patientBundleSize}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: fhirclient.FHIR.Bundle) => {
        return res;
      })
      .catch((_) => sendErrorNotification('Error Occured'));
  });

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <BrokenPage errorMessage={'An error occured'} />;
  }

  const resourceTypeMap: ResourceTypeMap = {};

  if (data && data.entry?.length) {
    for (const datum of data.entry) {
      const resourceTypeStr = (datum.resource && datum.resource.resourceType) as string;
      if (!resourceTypeMap[resourceTypeStr]) {
        resourceTypeMap[resourceTypeStr] = {
          count: 1,
          data: [datum.resource],
        };
      } else {
        const resourceCount = Number(resourceTypeMap[resourceTypeStr].count) + 1;
        resourceTypeMap[resourceTypeStr] = {
          count: resourceCount,
          data: [...resourceTypeMap[resourceTypeStr]?.data, datum.resource],
        };
      }
    }
  }

  const dataSource = resourceTypeMap[resourceType]?.data.map((d: Dictionary, index: number) => {
    const key = `${index}`;
    const id = d.id;
    const city = get(d, 'address.city');
    const country = get(d, 'address.country');
    const state = get(d, 'address.state');
    const name =
      getPatientName(d) ||
      get(d, 'code.coding.0.display') ||
      get(d, 'code.text') ||
      get(d, 'modifierExtension.0.valueReference.display') ||
      get(d, 'medicationCodeableConcept.coding.0.display') ||
      get(d, 'class.0.name') ||
      d.name;
    const date =
      get(d, 'effectiveDateTime') ||
      get(d, 'performedDateTime') ||
      get(d, 'occurrenceDateTime') ||
      get(d, 'performedPeriod.start') ||
      get(d, 'meta.lastUpdated') ||
      d.date;
    const reasonClass = get(d, 'class.display');
    const active = `${d.active}`;
    const value = buildObservationValueString(d);
    const gender = d.gender;
    const dob = d.birthDate;
    const category = get(d, 'category.0.coding.0.display');
    const identifier = `ID: ${d.id}`;
    const type =
      get(d, 'type.0.text') ||
      get(d, 'vaccineCode.text') ||
      get(d, 'vaccineCode.coding.0.display') ||
      get(d, 'vaccineCode.coding.0.code') ||
      get(d, 'type.0.coding.0.display');
    const status = d.status || get(d, 'achievementStatus.coding.0.code') || 'N/A';
    const reason =
      getPath(d, 'reason.0.coding.0.display') ||
      get(d, 'detail.code.coding.0.display') ||
      get(d, 'reasonCode.0.coding.0.display') ||
      'N/A';
    const resorceClass = 'N/A';
    const condition = get(d, 'code.text');
    const onsetDate = get(d, 'onsetDateTime');
    const vstatus = get(d, 'verificationStatus.coding.0.code') || 'N/A';
    const cstatus = get(d, 'clinicalStatus.coding.0.code') || 'N/A';
    const time = getPath(d, 'period.start');
    const details =
      getPath(d, 'description.text') ||
      getPath(d, 'code.text') ||
      getPath(d, 'code.coding.0.display') ||
      getPath(d, 'medicationCodeableConcept.coding.0.display') ||
      getPath(d, 'medicationCodeableConcept.coding.0.code') ||
      getPath(d, 'code.coding.0.code') ||
      getPath(d, 'result.0.display') ||
      d.description;
    // TODO: one immunization Recommendation resource can have more than a single recommendation
    const dateRecommendationCreated = get(d, 'date');
    const nextDoseDate = get(d, 'recommendation.0.dateCriterion.0.value');
    const dosesNum = get(d, 'recommendation.0.doseNumberPositiveInt');

    return {
      dosesNum,
      nextDoseDate,
      dateRecommendationCreated,
      key,
      id,
      name,
      city,
      country,
      state,
      date,
      active,
      value,
      gender,
      dob,
      category,
      identifier,
      type,
      status,
      reason,
      resorceClass,
      reasonClass,
      condition,
      onsetDate,
      vstatus,
      cstatus,
      time,
      details,
    };
  });

  const patientName = getPatientName(resourceTypeMap['Patient'].data[0]);
  const currentPatient = resourceTypeMap['Patient'].data[0];
  const { gender, birthDate } = currentPatient;
  const avatarLink = `https://www.gravatar.com/avatar/${patientId}?s=50&r=any&default=identicon&forcedefault=1`;
  return (
    <Row>
      <Col span={24}>
        <section className="layout-content">
          <Helmet>
            <title>{'Patient Details'}</title>
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
                      <Tag color="red">Deceased</Tag>
                    ) : null}
                  </h4>
                </Header>
                <Content>
                  {(() => {
                    const columnarData = [
                      {
                        UUID: get(currentPatient, 'identifier.0.value'),
                        ID: patientId,
                        Gender: gender,
                      },
                      {
                        'Birth Date': birthDate,
                        Phone: get(currentPatient, 'telecom.0.value'),
                        MRN: 'Unknown',
                      },
                      {
                        Address: get(currentPatient, 'address.0.line.0') || 'N/A',
                        Country: get(currentPatient, 'address.0.country'),
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
                      <IdcardOutlined /> {resourceType}
                    </span>
                  </>
                }
                bodyStyle={{ padding: '0 15px' }}
                bordered={false}
              >
                {resourceType === 'DocumentReference' ? (
                  <DocumentReferenceDetails
                    fhirBaseApiUrl={fhirBaseURL}
                    documentResources={
                      resourceTypeMap[resourceType].data as IfhirR4.IDocumentReference[]
                    }
                  />
                ) : (
                  <Table
                    dataSource={dataSource}
                    columns={resourcesSchema[resourceType]?.columns ?? []}
                    pagination={{
                      showQuickJumper: true,
                      showSizeChanger: true,
                      defaultPageSize: 5,
                      pageSizeOptions: ['5', '10', '20', '50', '100'],
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </section>
      </Col>
    </Row>
  );
};

PatientDetails.defaultProps = defaultEditPatientProps;

const PatientComponent = withRouter(PatientDetails);

/** Wrap component in QueryClientProvider
 *
 * @param {Object} props - component props
 * @returns {React.FC} - returns patients list view
 */
export function ConnectedPatientDetails(props: PatientDetailPropTypes) {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientComponent {...props} />
    </QueryClientProvider>
  );
}
