import {
  FormInstances,
  EditLocationUnit,
  LocationRouteProps,
  LocationUnit,
} from '@opensrp/location-management';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW } from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { commonHiddenFields, disabledTreeNodesCallback } from '../../helpers/utils';

type ServicePointAddTypes = CommonProps & RouteComponentProps<LocationRouteProps>;

const defaultProps = {
  ...defaultCommonProps,
};

/** Service point add edit form page
 *
 * @param props - the component props
 */
const ServicePointEdit = (props: ServicePointAddTypes) => {
  const locationUnitAddEditProps = {
    ...props,
    instance: FormInstances.EUSM,
    hidden: commonHiddenFields,
    successURLGenerator: (payload: LocationUnit) =>
      `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${payload.id}`,
    cancelURLGenerator: (payload: LocationUnit) =>
      `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${payload.id}`,
    disabled: ['isJurisdiction', 'parentId'],
    disabledTreeNodesCallback,
  };

  return <EditLocationUnit {...locationUnitAddEditProps} />;
};

ServicePointEdit.defaultProps = defaultProps;

export { ServicePointEdit };
