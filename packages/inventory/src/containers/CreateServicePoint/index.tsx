import React from 'react';
import { FormInstances, NewLocationUnit } from '@opensrp/location-management';
import { RouteComponentProps } from 'react-router';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import { LocationFormFields } from '@opensrp/location-management/dist/types/components/LocationForm/utils';

type ServicePointAddTypes = CommonProps & RouteComponentProps;

const defaultProps = {
  ...defaultCommonProps,
};

/** Service point add edit form page
 *
 * @param props - the component props
 */
const ServicePointsAdd = (props: ServicePointAddTypes) => {
  const { baseURL, ...restProps } = props;
  const locationUnitAddEditProps = {
    ...restProps,
    openSRPBaseURL: baseURL,
    instance: FormInstances.EUSM,
    hidden: ['extraFields', 'status', 'type', 'locationTags', 'externalId'],
    redirectAfterAction: INVENTORY_SERVICE_POINT_LIST_VIEW,
    disabled: ['isJurisdiction'],
    processInitialValues: (data: LocationFormFields) => ({ ...data, isJurisdiction: false }),
  };

  return <NewLocationUnit {...locationUnitAddEditProps} />;
};

ServicePointsAdd.defaultProps = defaultProps;

export { ServicePointsAdd };
