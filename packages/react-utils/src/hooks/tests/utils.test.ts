import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { matchesOnName } from '../utils';
import { hugeSinglePageData } from './fixtures';

test('search match util works correctly', () => {
  const singleCareTeam = hugeSinglePageData.entry[0].resource as IGroup;
  let result = matchesOnName(singleCareTeam, 'eam');
  expect(result).toBeTruthy();
  result = matchesOnName(singleCareTeam, 'EAm');
  expect(result).toBeTruthy();
  result = matchesOnName(singleCareTeam, 'non-existent');
  expect(result).toBeFalsy();
});
