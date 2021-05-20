/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Col, Row, Menu, Badge, Table, Card, Avatar, Tag } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Spin } from 'antd';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FHIR from 'fhirclient';
import get from 'lodash/get';
import { BrokenPage } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { fhirclient } from 'fhirclient/lib/types';
import { getPatientName, getPath, buildObservationValueString } from '../PatientsList/utils';
import { resourcesSchema } from '../PatientsList/resourcesSchema';
import { Dictionary } from '@onaio/utils';

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
}

/** type intersection for all types that pertain to the props */
export type PatientDetailPropTypes = PatientDetailProps & RouteComponentProps<RouteParams>;

/** default props for editing patient component */
export const defaultEditPatientProps: PatientDetailProps = {
  fhirBaseURL: '',
};

/** Component which shows FHIR resource details of a single patient
 *
 * @param {Object} props - PatientDetails component props
 * @returns {React.FC} returns patient resources display
 */
const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL } = props;
  const [resourceType, setResourceType] = React.useState<string>('Patient');
  const patientId = props.match.params['patientId'];

  const { error, data, isLoading } = useQuery('fetchPatient', async () => {
    return await FHIR.client(fhirBaseURL)
      .request(`Patient/${patientId}/$everything?_count=5000`)
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
      get(d, 'vaccineCode.coding.0.code');
    const status = d.status || get(d, 'achievementStatus.coding.0.code') || 'N/A';
    const reason =
      getPath(d, 'reason.0.coding.0.display') || get(d, 'detail.code.coding.0.display') || 'N/A';
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
      getPath(d, 'result.0.display');
    return {
      key,
      id,
      name,
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
          <Row className="patient-info-main">
            <Col md={12}>
              <div className="plan-avatar-detail-section">
                <span className="avatar-section">
                  <Avatar
                    /**Find the right icon */
                    src={avatarLink}
                    className=""
                    style={{
                      width: 80,
                      height: 82,
                      lineHeight: 1.8,
                      color: '#1CABE2',
                      fontSize: 50,
                    }}
                  />
                </span>
                <div className="patient-detail-section">
                  <div>
                    <h4>
                      {patientName}{' '}
                      {currentPatient.deceasedBoolean || currentPatient.deceasedDateTime ? (
                        <Tag color="red">Deceased</Tag>
                      ) : null}
                    </h4>
                  </div>
                  <div>
                    <span>ID: </span>
                    <span>{patientId}</span>
                  </div>
                  <div>
                    <span>Gender: </span>
                    <span>{gender}</span>
                  </div>
                  <div>
                    <span>Birth Date: </span>
                    <span>{birthDate}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <Row>
                <Col md={12} span={6}>
                  <span>Phone: </span>
                  <span>{get(currentPatient, 'telecom.0.value')}</span>
                </Col>
                <Col md={12} span={6}>
                  <span>MRN: </span>
                  <span>{'Unknown'}</span>
                </Col>
              </Row>
              <Row>
                <Col md={12} span={6}>
                  <span>Address: </span>
                  <span>{`${get(currentPatient, 'address.0.line.0') || 'N/A'}, ${
                    get(currentPatient, 'address.0.state') || 'N/A'
                  }`}</span>
                </Col>
              </Row>
              <Row>
                <Col md={12} span={6}>
                  <span>Country: </span>
                  <span>{`${get(currentPatient, 'address.0.country')}`}</span>
                </Col>
              </Row>
            </Col>
          </Row>
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
