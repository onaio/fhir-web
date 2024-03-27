import {
  getCharacteristicWithCode,
  getCharacteristicWithCoding,
  getAdministrativeLevelTypeCoding,
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
    system: 'https://smartregister.org/codes/administrative-level',
    code: `${level}`,
    display: `Level ${level}`,
  });
});
