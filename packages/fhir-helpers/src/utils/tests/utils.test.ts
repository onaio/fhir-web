import {
  getCharacteristicWithCode,
  getCharacteristicWithCoding,
  getAdministrativeLevelTypeCoding,
  getLocationAdmLevelCoding,
  getLocationAdmLevel,
} from '../utils';
import { characteristics } from './fixtures';

test('getCharacteristicWithCode works correctly', () => {
  let response = getCharacteristicWithCode(characteristics);
  expect(response).toEqual(characteristics);

  response = getCharacteristicWithCode(characteristics, 'http://smartregister.org/');
  expect(response).toEqual(characteristics);

  response = getCharacteristicWithCode(characteristics, undefined, '98734231');
  expect(response).toEqual([characteristics[0]]);

  response = getCharacteristicWithCode(characteristics, 'http://smartregister.org/', '98734231');
  expect(response).toEqual([characteristics[0]]);

  response = getCharacteristicWithCode(
    characteristics,
    'http://smartregister.org/codes',
    '98734231'
  );
  expect(response).toEqual([]);
});

test('getCharacteristicWithCoding works correctly', () => {
  const response = getCharacteristicWithCoding(characteristics, {
    system: 'http://smartregister.org/',
    code: '45647484',
    display: 'Donor',
  });
  expect(response).toEqual(characteristics[1]);
});

test('getAdministrativeLevelTypeCoding works correctly', () => {
  const level = 1;
  expect(getAdministrativeLevelTypeCoding(level)).toEqual({
    system: 'https://smartregister.org/CodeSystem/administrative-level',
    code: `${level}`,
    display: `Level ${level}`,
  });
});

test('getLocationAdmLevelCoding works correctly', () => {
  const admLevelTypeCoding = getAdministrativeLevelTypeCoding(1);
  const coding = { coding: [admLevelTypeCoding] };
  expect(getLocationAdmLevelCoding()).toEqual(undefined);
  expect(getLocationAdmLevelCoding([coding])).toEqual(admLevelTypeCoding);
});

test('getLocationAdmLevel works correctly', () => {
  const admLevelTypeCoding = getAdministrativeLevelTypeCoding(1);
  const coding = { coding: [admLevelTypeCoding] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getLocationAdmLevel(undefined as any)).toEqual(undefined);
  expect(getLocationAdmLevel([coding])).toEqual('1');
  admLevelTypeCoding.system = 'https://example.com';
  expect(getLocationAdmLevel([{ coding: [admLevelTypeCoding] }])).toEqual(undefined);
});
