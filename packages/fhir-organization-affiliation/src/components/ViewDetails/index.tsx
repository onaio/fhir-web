import React from 'react';
import { Col, Space, Spin, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { Resource404, BrokenPage } from '@opensrp/react-utils';
import FHIR from 'fhirclient';
import lang from '../../lang';
import { FHIR_PRACTITIONER_ROLE, URL_PRACTITIONER_ROLE } from '../../constants';
import { getPatientName } from '../CreateEditPractitionerRole/utils';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  practitionerRoleId: string;
  fhirBaseURL: string;
}

/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { practitionerRoleId, fhirBaseURL } = props;
  const history = useHistory();

  const { data, isLoading, error } = useQuery({
    queryKey: [`PractitionerRole/${practitionerRoleId}`],
    queryFn: () =>
      practitionerRoleId
        ? FHIR.client(fhirBaseURL).request(`${FHIR_PRACTITIONER_ROLE}/${practitionerRoleId}`)
        : undefined,
    select: (res) => res,
  });

  const practitioner = useQuery({
    queryKey: [`Practitioner/${data && data.practitioner && data.practitioner.reference}`],
    queryFn: () =>
      data && data.practitioner && data.practitioner.reference
        ? FHIR.client(fhirBaseURL).request(data.practitioner.reference)
        : undefined,
    select: (res) => res,
  });

  const organization = useQuery({
    queryKey: [`Organization/${data && data.organization && data.organization.reference}`],
    queryFn: () =>
      data && data.organization && data.organization.reference
        ? FHIR.client(fhirBaseURL).request(data.organization.reference)
        : undefined,
    select: (res) => res,
  });

  if (!practitionerRoleId) {
    return null;
  }

  if (error) {
    return <BrokenPage errorMessage={`${error}`} />;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_PRACTITIONER_ROLE)}
        />
      </div>
      {isLoading ? (
        <Spin size="large" className="custom-ant-spin" />
      ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !isLoading && practitionerRoleId && !data ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            {lang.IDENTIFIER}
          </Text>
          <Text type="secondary" className="display-block">
            {data.identifier[0].value}
          </Text>
          <Text strong={true} className="display-block">
            {lang.STATUS}
          </Text>
          <Text type="secondary" className="display-block">
            {data.active.toString()}
          </Text>
          {organization.data && organization.data.name ? (
            <>
              <Text strong={true} className="display-block">
                {lang.ORGANIZATION}
              </Text>
              <Text type="secondary" className="display-block">
                {organization.data.name}
              </Text>
            </>
          ) : (
            ''
          )}
          {practitioner.data && practitioner.data.name ? (
            <>
              <Text strong={true} className="display-block">
                {lang.PRACTITIONER}
              </Text>
              <Text type="secondary" className="display-block">
                {getPatientName(practitioner.data)}
              </Text>
            </>
          ) : (
            ''
          )}
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
