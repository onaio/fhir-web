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

/**
 *
 * @param props - CreateEditUser component props
 */

const fetchSingleResource = async (resource: string, patientId: string) => {
  return await client
    .request(`${resource}?patient=${patientId}&_count=500`)
    .then((res: any) => {
      return res;
    })
    .catch((_) => sendErrorNotification('Error Occured'));
};

const CreateEditPatient: React.FC<CreateEditPatientPropTypes> = (
  props: CreateEditPatientPropTypes
) => {
  const [resourceType, setResourceType] = React.useState<string>('Patient');
  const patientId = props.match.params['patientId'];

  const { error, data, isLoading } = useQuery(
    'fetchPatient',
    async () => {
      return await client
        .request(`Patient/${patientId}/$everything?_count=5000`)
        .then((res: any) => {
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

  const resourceTypeMap: any = {};

  if (data && data.entry.length) {
    for (const datum of data.entry) {
      if (!resourceTypeMap[datum.resource.resourceType]) {
        resourceTypeMap[datum.resource.resourceType] = {
          count: 1,
          data: [datum.resource],
        };
      } else {
        const resourceCount = Number(resourceTypeMap[datum.resource.resourceType].count) + 1;
        resourceTypeMap[datum.resource.resourceType] = {
          count: resourceCount,
          data: [...resourceTypeMap[datum.resource.resourceType].data, datum.resource],
        };
      }
    }
  }

  const dataSource = resourceTypeMap[resourceType]?.data.map((d: any, index: number) => {
    // console.log('display 1', getPath(d, 'code.coding.0.display'));
    // console.log('display 2', getPath(d, 'code.text'));
    // console.log('display 3', getPath(d, 'valueQuantity.code'));
    return {
      key: `${index}`,
      id: d.id,
      name:
        getPatientName(d) ||
        get(d, 'code.coding.0.display') ||
        get(d, 'code.text') ||
        get(d, 'modifierExtension.0.valueReference.display') ||
        get(d, 'medicationCodeableConcept.coding.0.display') ||
        d.name,
      date:
        get(d, 'effectiveDateTime') ||
        get(d, 'performedDateTime') ||
        get(d, 'occurrenceDateTime') ||
        get(d, 'performedPeriod.start') ||
        get(d, 'meta.lastUpdated') ||
        d.date,
      active: `${d.active}`,
      value: `${get(d, 'valueQuantity.value')} ${get(d, 'valueQuantity.unit')}` || 'N/A',
      gender: d.gender,
      dob: d.birthDate,
      category: get(d, 'category.0.coding.0.display'),
      identifier: `ID: ${d.id}`,
      type: getPath(d, 'type.0.text') || get(d, 'vaccineCode.coding.0.display'),
      status: d.status || get(d, 'achievementStatus.coding.0.code') || 'N/A',
      reason:
        getPath(d, 'reason.0.coding.0.display') || get(d, 'detail.code.coding.0.display') || 'N/A',
      class: 'N/A',
      condition: get(d, 'code.text'),
      onsetDate: get(d, 'onsetDateTime'),
      vstatus: get(d, 'verificationStatus.coding.0.code') || 'N/A',
      cstatus: get(d, 'clinicalStatus.coding.0.code') || 'N/A',
      time: getPath(d, 'period.start'),
      details:
        getPath(d, 'description.text') ||
        getPath(d, 'code.text') ||
        getPath(d, 'code.coding.0.display') ||
        getPath(d, 'medicationCodeableConcept.coding.0.display') ||
        getPath(d, 'medicationCodeableConcept.coding.0.code') ||
        getPath(d, 'code.coding.0.code') ||
        getPath(d, 'result.0.display'),
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
                    onClick={async (e: any) => {
                      // await fetchSingleResource(e.key, patientId);
                      setResourceType(e.key);
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
                columns={(resourcesSchema as any)[resourceType]?.columns ?? []}
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

CreateEditPatient.defaultProps = defaultEditPatientProps;

const PatientComponent = withRouter(CreateEditPatient);

/** Wrap component in QueryClientProvider
 *
 * @returns {React.FC} - returns patients list view
 */
export function ConnectedCreateEditPatient() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientComponent keycloakBaseURL="" />
    </QueryClientProvider>
  );
}
