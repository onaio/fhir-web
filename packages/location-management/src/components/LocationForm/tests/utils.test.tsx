import { rawHierarchy } from '../../../ducks/locationHierarchy/tests/hierarchyFixtures';
import { generateJurisdictionTree } from '../../../ducks/locationHierarchy/utils';
import {
  FormInstances,
  generateLocationUnit,
  getLocationFormFields,
  getLocationTagOptions,
  getServiceTypeOptions,
  treeToOptions,
} from '../utils';
import {
  expectedFormFields,
  expectedFormFields1,
  location1,
  locationUnitGroups,
  generatedLocation1,
  serviceTypeSettings,
} from './fixtures';

describe('locationForm.utils', () => {
  it('getLocationFormFields works with default values', () => {
    const res = getLocationFormFields();
    expect(res).toEqual(expectedFormFields);
    const res1 = getLocationFormFields(undefined, FormInstances.EUSM, false);
    expect(res1).toEqual({
      ...expectedFormFields,
      instance: FormInstances.EUSM,
      isJurisdiction: false,
    });
  });
  it('gets form fields from location unit', () => {
    const res = getLocationFormFields(location1);
    expect(res).toEqual(expectedFormFields1);
    const res1 = getLocationFormFields(location1, FormInstances.EUSM, false);
    expect(res1).toEqual({
      ...expectedFormFields1,
      instance: FormInstances.EUSM,
      isJurisdiction: false,
    });
  });
  it('is able to generate location unit from form', () => {
    const res = generateLocationUnit(expectedFormFields1, 'ComboBox', [locationUnitGroups[0]]);
    expect(res).toEqual(generatedLocation1);
  });
  it('can compute service type select options', () => {
    const res = getServiceTypeOptions([]);
    expect(res).toEqual([]);

    const res1 = getServiceTypeOptions(serviceTypeSettings);
    expect(res1).toEqual([
      { label: 'School', value: 'School' },
      { label: 'Hospital', value: 'Hospital' },
    ]);
  });
  it('can compute location tag select options', () => {
    const res = getLocationTagOptions([]);
    expect(res).toEqual([]);

    const res1 = getLocationTagOptions([locationUnitGroups[0]]);
    expect(res1).toEqual([{ label: 'Sample 2', value: 2 }]);
  });

  it('is able to get tree select options', () => {
    const trees = [rawHierarchy[2]].map(generateJurisdictionTree);
    const res = treeToOptions(trees);
    expect(res).toEqual([{ title: 'Malawi', value: '6bf9c085-350b-4bb2-990f-80dc2caafb33' }]);
  });
});
