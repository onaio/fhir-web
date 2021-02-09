import { FormInstances, EditLocationUnit, LocationRouteProps } from '@opensrp/location-management';
import { INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import React from 'react';
import { RouteComponentProps } from 'react-router';

type ServicePointAddTypes = CommonProps & RouteComponentProps<LocationRouteProps>;

const defaultProps = {
  ...defaultCommonProps,
};

/** Service point add edit form page
 *
 * @param props - the component props
 */
const ServicePointEdit = (props: ServicePointAddTypes) => {
  const { baseURL, ...restProps } = props;
  const locationUnitAddEditProps = {
    ...restProps,
    openSRPBaseURL: baseURL,
    instance: FormInstances.EUSM,
    hidden: ['extraFields', 'status', 'type', 'locationTags', 'externalId'],
    redirectAfterAction: INVENTORY_SERVICE_POINT_LIST_VIEW,
    disabled: ['isJurisdiction'],
  };

  return <EditLocationUnit {...locationUnitAddEditProps} />;
};

ServicePointEdit.defaultProps = defaultProps;

export { ServicePointEdit };
