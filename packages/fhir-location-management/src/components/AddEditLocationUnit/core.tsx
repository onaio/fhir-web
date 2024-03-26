import React from 'react';
import { BaseNewEditLocationUnit, BaseNewEditLocationUnitProps } from './base';
import { URL_LOCATION_UNIT, serviceType } from '../../constants';

export type NewEditLocationUnitProps = BaseNewEditLocationUnitProps;

/**
 * renders page where user can create new location unit
 *
 * @param props - this components props
 */
export const NewEditLocationUnit = (props: NewEditLocationUnitProps) => {
  const baseNewEditViewProps = {
    ...props,
    successURLGenerator: () => URL_LOCATION_UNIT,
    cancelURLGenerator: () => URL_LOCATION_UNIT,
    hidden: [serviceType],
  };

  return <BaseNewEditLocationUnit {...baseNewEditViewProps} />;
};
