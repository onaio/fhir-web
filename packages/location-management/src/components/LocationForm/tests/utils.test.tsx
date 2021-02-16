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
  location3,
  location2,
  location4,
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
  it('generates long and lat correctly from locations geometry', () => {
    const res1 = getLocationFormFields(location3);
    expect(res1.geometry).toEqual('{"type":"Point","coordinates":[49.52125,-16.78147]}');
    expect(res1.longitude).toEqual('49.52125');
    expect(res1.latitude).toEqual('-16.78147');
    // one without geometry
    const res2 = getLocationFormFields(location2);
    expect(res2.geometry).toBeUndefined();
    expect(res2.longitude).toBeUndefined();
    expect(res2.latitude).toBeUndefined();

    // one whose geometry is not a point
    const res3 = getLocationFormFields(location4);
    expect(res3.geometry).toEqual(
      '{"type":"Polygon","coordinates":[[[17.4298095703125,29.897805610155874],[17.215576171875,29.750070930806785],[17.4957275390625,29.3965337391284],[17.9901123046875,29.54000879252545],[18.006591796874996,29.79298413547051],[17.4298095703125,29.897805610155874]]]}'
    );
    expect(res3.longitude).toBeUndefined();
    expect(res3.latitude).toBeUndefined();
  });
  it('derives correct isJurisdiction status from location unit', () => {
    const res = getLocationFormFields({ ...location1, isJurisdiction: false });
    expect(res).toEqual({ ...expectedFormFields1, isJurisdiction: false });
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
