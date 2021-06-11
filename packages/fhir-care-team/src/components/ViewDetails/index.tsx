import React from 'react';
import { Col, Space, Spin, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { Resource404 } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import FHIR from 'fhirclient';
import lang from '../../lang';
import { FHIR_CARE_TEAM, URL_CARE_TEAM } from '../../constants';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  careTeamId: string;
  fhirBaseURL: string;
}

/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { careTeamId, fhirBaseURL } = props;
  const history = useHistory();

  const { data, isLoading } = useQuery(
    `CareTeam/${careTeamId}`,
    () => FHIR.client(fhirBaseURL).request(`${FHIR_CARE_TEAM}/${careTeamId}`),
    {
      refetchOnWindowFocus: false,
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: any) => res,
    }
  );

  if (!careTeamId) {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_CARE_TEAM)}
        />
      </div>
      {isLoading ? (
        <Spin size="large" className="custom-ant-spin" />
      ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !isLoading && careTeamId && !data ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            {lang.NAME}
          </Text>
          <Text type="secondary" className="display-block">
            {data.name}
          </Text>
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
            {data.status}
          </Text>
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
