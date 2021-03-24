/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Col, Row, Menu, Badge, Table } from 'antd';
import { Helmet } from 'react-helmet';
import { Spin } from 'antd';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FHIR from 'fhirclient';
import get from 'lodash/get';
import { BrokenPage } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { fhirclient } from 'fhirclient/lib/types';
import { getPatientName, getPath } from '../PatientsList/utils';
import { resourcesSchema } from '../PatientsList/resourcesSchema';
import { Dictionary } from '@onaio/utils';

const queryClient = new QueryClient();

const client = FHIR.client('https://r4.smarthealthit.org');

// Interface for route params
interface RouteParams {
  patientId: string;
}

// Interface for resourceTypeMap
interface ResourceTypeMap {
  [key: string]: { count: number; data: fhirclient.FHIR.Resource[] };
}

/** props for editing a user view */
export interface EditPatientProps {
  keycloakBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditPatientPropTypes = EditPatientProps & RouteComponentProps<RouteParams>;

/** default props for editing patient component */
export const defaultEditPatientProps: EditPatientProps = {
  keycloakBaseURL: '',
};

const PatientDetails: React.FC<CreateEditPatientPropTypes> = (
  props: CreateEditPatientPropTypes
) => {
  const [resourceType, setResourceType] = React.useState<string>('Patient');
  const patientId = props.match.params['patientId'];

  const { error, data, isLoading } = useQuery(
    'fetchPatient',
    async () => {
      return await client
        .request(`Patient/${patientId}/$everything?_count=5000`)
        .then((res: fhirclient.FHIR.Bundle) => {
          return res;
        })
        .catch((_) => sendErrorNotification('Error Occured'));
    },
    { retry: false }
  );

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
    const value =
      `${get(d, 'valueQuantity.value') || ''} ${get(d, 'valueQuantity.unit') || ''}` || 'N/A';
    const gender = d.gender;
    const dob = d.birthDate;
    const category = get(d, 'category.0.coding.0.display');
    const identifier = `ID: ${d.id}`;
    const type = getPath(d, 'type.0.text') || get(d, 'vaccineCode.coding.0.display');
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

  return (
    <Row>
      <Col span={24}>
        <section className="layout-content">
          <Helmet>
            <title>{'Patient Details'}</title>
          </Helmet>
          <h5 className="mb-3">{`Patient details - ${patientName}`}</h5>
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
 * @returns {React.FC} - returns patients list view
 */
export function ConnectedPatientDetails() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientComponent keycloakBaseURL="" />
    </QueryClientProvider>
  );
}
