import React from 'react';
import { FormInstances, LocationUnit, NewLocationUnit } from '@opensrp-web/location-management';
import { RouteComponentProps } from 'react-router';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  GEOJSON_TYPE_STRING,
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
} from '../../constants';
import { LocationFormFields } from '@opensrp-web/location-management/dist/types/components/LocationForm/utils';
import { commonHiddenFields, disabledTreeNodesCallback } from '../../helpers/utils';

type ServicePointAddTypes = CommonProps & RouteComponentProps;

const defaultProps = {
  ...defaultCommonProps,
};

/** Service point add edit form page
 *
 * @param props - the component props
 */
const ServicePointsAdd = (props: ServicePointAddTypes) => {
  const locationUnitAddEditProps = {
    ...props,
    instance: FormInstances.EUSM,
    hidden: commonHiddenFields,
    successURLGenerator: (payload?: LocationUnit) =>
      `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${payload?.id}`, // todo if payload is missing
    cancelURLGenerator: () => INVENTORY_SERVICE_POINT_LIST_VIEW,
    disabled: ['isJurisdiction'],
    processInitialValues: (data: LocationFormFields) => ({
      ...data,
      isJurisdiction: false,
      type: GEOJSON_TYPE_STRING,
    }),
    disabledTreeNodesCallback,
  };

  return <NewLocationUnit {...locationUnitAddEditProps} />;
};

ServicePointsAdd.defaultProps = defaultProps;

export { ServicePointsAdd };
