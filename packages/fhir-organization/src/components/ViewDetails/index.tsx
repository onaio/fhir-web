import React from 'react';
import { Col, Space, Spin, Button, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { FHIRServiceClass, SingleKeyNestedValue } from '@opensrp/react-utils';
import { URL_ORG_AFFILIATION } from '../../constants';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { get } from 'lodash';

export const parseOrganization = (org: IOrganization) => {
  return {
    id: org.id,
    status: org.active ? 'True' : 'False',
    name: org.name,
    type: get(org, 'type.0.coding.0.display'),
    alias: org.alias,
    partOf: get(org, 'partOf.display'),
  };
};

/** typings for the view details component */
export interface ViewDetailsProps {
  resourceId: string;
  fhirBaseURL: string;
}

/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseURL } = props;
  const history = useHistory();

  // TODO - magic string
  const { data: organization, isLoading: orgIsLoading, error: orgError } = useQuery(
    ['Organization', resourceId],
    () => new FHIRServiceClass<IOrganization>(fhirBaseURL, 'Organization').read(resourceId),
    {
      enabled: !!resourceId,
    }
  );

  if (!resourceId) {
    return null;
  }

  if (orgError && !organization) {
    return <Alert type="error" message={`${orgError}`} />;
  }

  const org = organization as IOrganization;

  const { name, type, alias, partOf } = parseOrganization(org);

  const keyValues = {
    Name: name,
    Alias: alias,
    Type: type,
    partOf: partOf,
  };

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_ORG_AFFILIATION)}
        />
      </div>
      {orgIsLoading ? (
        <Spin />
      ) : (
        <Space direction="vertical">
          {Object.entries(keyValues).map(([key, value]) => {
            const props = {
              [key]: value,
            };
            return (
              <div key={key}>
                <SingleKeyNestedValue {...props} />;
              </div>
            );
          })}
        </Space>
      )}
    </Col>
  );
};
