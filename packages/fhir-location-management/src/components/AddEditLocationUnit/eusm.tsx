import React from 'react';
import { LocationFormProps } from '../LocationForm';
import { eusmServicePointValidationRules } from '../LocationForm/utils';
import { BaseNewEditLocationUnit, BaseNewEditLocationUnitProps } from './base';
import { URL_SERVICE_POINT_LIST, isJurisdiction } from '../../constants';

export type EusmAddEditLocationUnitProps = BaseNewEditLocationUnitProps;

/**
 * renders page where user can create new location unit
 *
 * @param props - this components props
 */
export const EusmAddEditLocationUnit = (props: EusmAddEditLocationUnitProps) => {
  const updateLocationFormProps = (initialFormProps: LocationFormProps) => {
    const { initialValues } = initialFormProps;
    const eusmInitialValues = {
      ...initialValues,
      isJurisdiction: initialValues.id ? initialValues.isJurisdiction : false,
      hidden: ['isJurisdiction'],
    };
    return {
      ...initialFormProps,
      validationRulesFactory: eusmServicePointValidationRules,
      initialValues: eusmInitialValues,
    };
  };

  const baseNewEditViewProps = {
    ...props,
    updateLocationFormProps,
    successURLGenerator: () => URL_SERVICE_POINT_LIST,
    cancelURLGenerator: () => URL_SERVICE_POINT_LIST,
    hidden: [isJurisdiction],
    URL_SERVICE_POINT_LIST,
  };

  return <BaseNewEditLocationUnit {...baseNewEditViewProps} />;
};
