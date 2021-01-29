import { LocationUnit } from 'location-management/src/ducks/location-units';
import { defaultFormField, FormFields } from './Form';

export enum FormInstances {
  CORE = 'core',
  EUSM = 'eusm',
}

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
