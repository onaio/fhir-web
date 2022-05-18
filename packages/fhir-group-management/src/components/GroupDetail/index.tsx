import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Spin, Alert, Space } from 'antd';
import { Group } from '../../types';
import { useHistory } from 'react-router';
import { groupResourceType, LIST_GROUP_URL } from '../../constants';
import { useQuery } from 'react-query';
import {
  FHIRServiceClass,
  SingleKeyNestedValue,
  intlFormatDateStrings,
} from '@opensrp/react-utils';
import { get } from 'lodash';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../mls';

/**
 * parse a Group to object we can easily consume in Table layout
 *
 * @param obj - the organization resource object
 */
export const parseGroup = (obj: IGroup) => {
  return {
    name: obj.name,
    active: obj.active,
    id: obj.id,
    lastUpdated: intlFormatDateStrings(get(obj, 'meta.lastUpdated')),
    members: obj.member,
    quantity: obj.quantity,
  };
};

/** typings for the view details component */
export interface ViewDetailsProps {
  resourceId: string;
  fhirBaseURL: string;
}

export type ViewDetailsWrapperProps = Pick<ViewDetailsProps, 'fhirBaseURL'> & {
  resourceId?: string;
};

/**
 * Displays Organization Details
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseURL } = props;
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery([groupResourceType, resourceId], () => {
    return new FHIRServiceClass<Group>(fhirBaseURL, groupResourceType).read(resourceId);
  });

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <Alert type="error" message={`${error}`} />;
  }

  const org = data as Group;
  const { name, active, lastUpdated, id, quantity, members } = parseGroup(org);
  const keyValues = {
    [t('Id')]: id,
    [t('Name')]: name,
    [t('Active')]: active ? 'Active' : 'Inactive',
    [t('Last updated')]: lastUpdated,
    [t('No. of Members')]: quantity,
    [t('Members')]: members?.map((member) => member.entity.display).join(', '),
  };

  return (
    <Space direction="vertical">
      {Object.entries(keyValues).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
    </Space>
  );
};

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ViewDetailsWrapper = (props: ViewDetailsWrapperProps) => {
  const { resourceId, fhirBaseURL } = props;
  const history = useHistory();

  if (!resourceId) {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          data-testid="close-button"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(LIST_GROUP_URL)}
        />
      </div>
      <ViewDetails resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
    </Col>
  );
};
