import { getPatientName, getPatientStatus } from '../utils';

test('get patient name for undefined', () => {
  expect(getPatientName()).toEqual('');
});

test('getPatientStatus works correctly', () => {
  const t = (x: string) => x;
  expect(getPatientStatus(true, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(true, false, t)).toEqual({ title: t('Active'), color: 'green' });
  expect(getPatientStatus(false, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(false, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(false, false, t)).toEqual({ title: t('Inactive'), color: 'gray' });
});
