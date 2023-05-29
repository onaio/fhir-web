import MockDate from 'mockdate';
import { getPayload } from '../utils';
import { assignments, samplePlan } from './fixtures';

describe('Assignment/helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    MockDate.set('12/30/2020');
  });

  it('works for new assignments', () => {
    const selectedOrgs = ['1', '2', '3'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a'
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('works for removing assignments', () => {
    const initialOrgs = ['1', '2', '3'];
    const selectedOrgs = ['1'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs,
      assignments
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('works for removing and adding at the same time assignments', () => {
    const initialOrgs = [
      '2ea3733c-04fa-4136-b091-726ec3205422',
      '676bd889-e9ee-4f2b-94c3-0509466ad9be',
      'e740e6b8-98dc-4d99-af34-ab2eb602da00',
    ];
    const selectedOrgs = [
      '2ea3733c-04fa-4136-b091-726ec3205422',
      'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    ];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs,
      assignments
    );
    expect(payload).toEqual([
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2ea3733c-04fa-4136-b091-726ec3205422',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2021-02-04T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '676bd889-e9ee-4f2b-94c3-0509466ad9be',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('does not allow duplicates', () => {
    const initialOrgs = ['2', '3'];
    const selectedOrgs = ['1', '1', '1'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs,
      assignments
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2020-12-30T00:00:00+00:00',
      },
    ]);
  });
});
