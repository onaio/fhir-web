import { LocationUnit } from 'location-management/src/ducks/location-units';
import { FormFields } from './Form';

export const getLocationFormFields = (
  location: LocationUnit,
  instance: FormInstances
): FormFields => {
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

export enum FormInstances {
  CORE = 'core',
  EUSM = 'eusm',
}
