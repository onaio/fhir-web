import { getLocationFormFields, FormInstances } from '../utils';
import { servicePoint1 } from './fixtures';

describe('location-management.LocationUnitAddEdit.utils', () => {
  it('works nominally for included object', () => {
    const expected = {
      geographicLevel: 1,
      geometry: undefined,
      id: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
      instance: 'core',
      locationTags: [3],
      name: 'Sousse',
      parentId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
      serviceTypes: ['Test service type'],
      status: 'Active',
      type: 'Feature',
      version: 0,
    };

    let result = getLocationFormFields(servicePoint1);
    expect(result).toEqual(expected);
    result = getLocationFormFields(servicePoint1, FormInstances.EUSM);
    expect(result).toEqual({ ...expected, instance: 'eusm' });
  });

  it('works ok when location is undefined', () => {
    const expected = {
      externalId: '',
      instance: 'eusm',
      isJurisdiction: false,
      locationTags: [],
      name: '',
      serviceTypes: '',
      status: 'Active',
      type: '',
    };

    let result = getLocationFormFields(undefined, FormInstances.EUSM);
    expect(result).toEqual(expected);
    result = getLocationFormFields();
    expect(result).toEqual({ ...expected, instance: FormInstances.CORE });
  });
});
