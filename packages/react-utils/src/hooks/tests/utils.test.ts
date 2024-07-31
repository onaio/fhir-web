import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { filterDescToSearchParams, matchesOnName, SortDescToSearchParams } from '../utils';
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

test('generates a search param from sort description', () => {
  let result = SortDescToSearchParams({});
  expect(result).toEqual({});

  result = SortDescToSearchParams({ name: { paramAccessor: 'name', order: 'descend' } });
  expect(result).toEqual({
    _sort: '-name',
  });

  result = SortDescToSearchParams({
    name: { paramAccessor: 'name', order: 'ascend' },
    status: { paramAccessor: 'status', order: 'descend' },
  });
  expect(result).toEqual({
    _sort: 'name,-status',
  });
});

test('generates a search param from filter description', () => {
  let result = filterDescToSearchParams({});
  expect(result).toEqual({});

  result = filterDescToSearchParams({
    name: { paramAccessor: 'name', rawValue: 'zakayo', paramValue: 'PORK' },
  });
  expect(result).toEqual({
    name: 'PORK',
  });
});
