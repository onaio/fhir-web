import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Spin, Alert } from 'antd';
import { Group } from '../../../types';
import { useHistory } from 'react-router';
import { groupResourceType, LIST_GROUP_URL } from '../../../constants';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { get } from 'lodash';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../../mls';
import { TFunction } from 'i18n/dist/types';

/**
 * parse a Group to object we can easily consume in Table layout
 *
 * @param obj - the organization resource object
 */
export const parseGroup = (obj: IGroup) => {
  const { name, active, quantity, member, id, type, characteristic } = obj;
  return {
    name,
    active,
    id,
    lastUpdated: get(obj, 'meta.lastUpdated'),
    members: member,
    quantity,
    type,
    characteristic,
  };
};

/** typings for the view details component */
export interface ViewDetailsProps {
  resourceId: string;
  fhirBaseURL: string;
  keyValueMapperRenderProp: (obj: IGroup, t: TFunction) => JSX.Element;
}

export type ViewDetailsWrapperProps = Pick<
  ViewDetailsProps,
  'fhirBaseURL' | 'keyValueMapperRenderProp'
> & {
  resourceId?: string;
};

/**
 * Displays Organization Details
 *
 * @param props - detail view component props
 */
export const ViewDetails = (props: ViewDetailsProps) => {
  const { resourceId, fhirBaseURL, keyValueMapperRenderProp } = props;
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
  return keyValueMapperRenderProp(org, t);
};

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
export const ViewDetailsWrapper = (props: ViewDetailsWrapperProps) => {
  const { resourceId, fhirBaseURL, keyValueMapperRenderProp } = props;
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
      <ViewDetails
        resourceId={resourceId}
        fhirBaseURL={fhirBaseURL}
        keyValueMapperRenderProp={keyValueMapperRenderProp}
      />
    </Col>
  );
};
