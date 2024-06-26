import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { checkFilter, matchesOnName } from '../utils';
import { hugeSinglePageData } from './fixtures';

test('search match util works correctly', () => {
  const singleCareTeam = hugeSinglePageData.entry[0].resource as IGroup;
  let result = matchesOnName(singleCareTeam, '7Tes');
  expect(result).toBeTruthy();
  result = matchesOnName(singleCareTeam, '7TES');
  expect(result).toBeTruthy();
  result = matchesOnName(singleCareTeam, 'non-existent');
  expect(result).toBeFalsy();
});

test('check filter works correctly', () => {
  const sampleItem = {
    name: 'RejectFB24',
  };
  let result = checkFilter(sampleItem, 'name', { operand: '===', value: 'tanoTena' });
  expect(result).toBeFalsy();
  result = checkFilter(sampleItem, 'name', { operand: '!==', value: 'tanoTena' });
  expect(result).toBeTruthy();
  result = checkFilter(sampleItem, 'nonExistent', { operand: '===', value: 'RejectFB24' });
  expect(result).toBeFalsy();
  result = checkFilter(sampleItem, 'name', { operand: 'includes', value: 'reject' });
  expect(result).toBeTruthy();
  result = checkFilter(sampleItem, 'name', {
    operand: 'includes',
    value: 'reject',
    caseSensitive: true,
  });
  expect(result).toBeFalsy();
});
