import React from 'react';
import { Col, Space, Spin, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery, useQueries } from 'react-query';
import { Dictionary } from '@onaio/utils';
import { Resource404, BrokenPage } from '@opensrp/react-utils';
import FHIR from 'fhirclient';
import { IfhirR4 } from '@smile-cdr/fhirts';
import lang from '../../lang';
import { FHIR_ORG_AFFILIATION, URL_ORG_AFFILIATION } from '../../constants';

const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  orgAffiliationId: string;
  fhirBaseURL: string;
}

export interface Reference {
  display: string;
  reference: string;
}

/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { orgAffiliationId, fhirBaseURL } = props;
  const history = useHistory();

  const { data, isLoading, error } = useQuery({
    queryKey: [`OrganizationAffiliation/${orgAffiliationId}`],
    queryFn: () =>
      orgAffiliationId
        ? FHIR.client(fhirBaseURL).request(`${FHIR_ORG_AFFILIATION}/${orgAffiliationId}`)
        : undefined,
    select: (res) => res,
  });

  const locations = useQueries(
    data && data.location
      ? data.location.map((p: Reference) => {
          return {
            queryKey: [FHIR_ORG_AFFILIATION, p.reference],
            queryFn: () => FHIR.client(fhirBaseURL).request(p.reference),
            // Todo : useQueries doesn't support select or types yet https://github.com/tannerlinsley/react-query/pull/1527
            select: (res: IfhirR4.ILocation) => res,
          };
        })
      : []
  );

  const organization = useQuery({
    queryKey: [`Organization/${data && data.organization && data.organization.reference}`],
    queryFn: () =>
      data && data.organization && data.organization.reference
        ? FHIR.client(fhirBaseURL).request(data.organization.reference)
        : undefined,
    select: (res) => res,
  });

  if (!orgAffiliationId) {
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
          onClick={() => history.push(URL_ORG_AFFILIATION)}
        />
      </div>
      {isLoading || organization.isLoading ? (
        <Spin size="large" className="custom-ant-spin" />
      ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !isLoading && orgAffiliationId && !data ? (
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
          <Text strong={true} className="display-block">
            {lang.LOCATION}
          </Text>
          {locations.length
            ? locations.map((datum: Dictionary) => (
                <>
                  <Text type="secondary" className="display-block">
                    {datum.data.name}
                  </Text>
                </>
              ))
            : ''}
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
