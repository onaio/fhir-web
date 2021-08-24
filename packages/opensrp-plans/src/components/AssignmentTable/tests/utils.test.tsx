import { processRawAssignments } from '@opensrp-web/team-assignment';
import { compressAssignments, getDataSource, mergeIdsWithNames } from '../utils';
import {
  expectedMergedIds1,
  organizations,
  sampleRawAssignment1,
  sampleRawAssignments,
} from './fixtures';

describe('team assignment table utils', () => {
  it('can compress Assignments', () => {
    const sampleAssignments = processRawAssignments([
      ...sampleRawAssignments,
      sampleRawAssignment1,
    ]);
    const response = compressAssignments(sampleAssignments);
    const expected = {
      '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb': ['1', '9d0e8399-9c5e-5ad2-a73c-a86e00d5e699'],
      '9b5dd829-89de-45a5-98f2-fd37787ae949': ['258b4dec-79d3-546d-9c5c-f172aa7e03b0'],
      '9b5dd829-89de-45a5-98f2-fd37787ae949,1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb': [
        '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
      ],
    };

    expect(response).toEqual(expected);
  });

  it('compress assignments works with empty arg', () => {
    const response = compressAssignments([]);
    const expected = {};

    expect(response).toEqual(expected);
  });

  it('can merge id with names', () => {
    const sampleAssignments = processRawAssignments(sampleRawAssignments);
    const response = compressAssignments(sampleAssignments);
    const received = mergeIdsWithNames(response, organizations, []);
    expect(received).toEqual(expectedMergedIds1);
  });

  it('gets dataSource for planJurisdictions only', () => {
    const response = getDataSource([], [], [], ['9b5dd829-89de-45a5-98f2-fd37787ae94']);
    expect(response).toEqual([
      {
        jurisdictions: '9b5dd829-89de-45a5-98f2-fd37787ae94',
        key: 'plans-0',
        organizations: ' - ',
      },
    ]);
  });
});
