import { Dictionary } from 'cycle';
import { LocationUnit, LocationUnitStatus } from '../../ducks/location-units';

export enum FormInstances {
  CORE = 'core',
  EUSM = 'eusm',
}

/** describes known fields that the form will have */
export interface FormFields extends Dictionary {
  instance?: FormInstances;
  id?: string;
  name: string;
  status: LocationUnitStatus;
  type: string;
  parentId?: string;
  externalId?: string;
  locationTags?: number[];
  geometry?: string;
  isJurisdiction?: boolean;
  serviceTypes?: string[] | string;
}

export const defaultFormField: FormFields = {
  instance: FormInstances.CORE,
  name: '',
  status: LocationUnitStatus.ACTIVE,
  type: '',
  isJurisdiction: false,
  serviceTypes: '',
  locationTags: [],
  externalId: '',
};

export const getLocationFormFields = (
  location?: LocationUnit,
  instance: FormInstances = FormInstances.CORE
): FormFields => {
  if (!location) {
    return {
      ...defaultFormField,
      instance,
    };
  }
  const formFields = {
    id: location.id,
    instance,
    ...location.properties,
    locationTags: location.locationTags?.map((loc) => loc.id),
    geometry: JSON.stringify(location.geometry),
    type: location.type,
  };

  // remove the existing formFields
  delete formFields.serviceTypes;

  const finalFormFields = {
    ...formFields,
    serviceTypes: location.properties.serviceTypes?.map((type) => type.name) ?? [],
  };

  return finalFormFields;
};
