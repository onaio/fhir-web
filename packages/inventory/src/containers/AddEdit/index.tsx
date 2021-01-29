import React from 'react';
import {
  LocationUnitAddEdit,
  LocationUnitAddEditProps,
  FormInstances,
} from '@opensrp/location-management';
import { CommonProps } from 'inventory/src/helpers/common';
import { RouteComponentProps } from 'react-router';

type ServicePointsAddEditType = CommonProps & RouteComponentProps;

/** Service point add edit form page
 *
 * @param props - the component props
 */
const ServicePointsAddEdit = (props: ServicePointsAddEditType) => {
  const { baseURL, ...restProps } = props;
  const locationUnitAddEditProps: LocationUnitAddEditProps = {
    ...restProps,
    openSRPBaseURL: baseURL,
    instance: FormInstances.EUSM,
    hiddenFields: ['extraFields', 'status', 'isJurisdiction', 'type', 'locationTags', 'externalId'],
  };

  return <LocationUnitAddEdit {...locationUnitAddEditProps} />;
};

export { ServicePointsAddEdit };
