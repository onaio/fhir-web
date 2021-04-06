export const assignment1 = {
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'outpost-number-one',
  organization: 'griff',
  plan: 'alpha',
  toDate: '2019-12-31T16:00:01-08:00',
};
export const assignment2 = {
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'outpost-number-one',
  organization: 'simons',
  plan: 'alpha',
  toDate: '2019-12-31T16:00:01-08:00',
};
export const assignment3 = {
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'blue-base',
  organization: 'tucker',
  plan: 'alpha',
  toDate: '2019-12-31T16:00:01-08:00',
};
export const assignment4 = {
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'blue-base',
  organization: 'caboose',
  plan: 'alpha',
  toDate: '2019-12-31T16:00:01-08:00',
};
export const assignment5 = {
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'blue-base',
  organization: 'caboose',
  plan: 'beta',
  toDate: '2019-12-31T16:00:01-08:00',
};
export const assignment6 = {
  // slightly different from 1
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'outpost-number-one',
  organization: 'griff',
  plan: 'alpha',
  toDate: '1979-12-31T16:00:01-08:00', // different end date to simulate retirement
};
export const assignment7 = {
  // slightly different from 1
  fromDate: '2019-08-31T16:00:00-08:00',
  jurisdiction: 'outpost-number-one',
  organization: 'griff',
  plan: 'alpha',
  toDate: '2020-12-31T16:00:01-08:00', // different end date to simulate retirement
};
export const assignments = [assignment1, assignment2, assignment3, assignment4];

export const rawAssignment1 = [
  {
    organizationId: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
    jurisdictionId: '7d150b42-11e7-4362-8d0d-1a8ef506c754',
    planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
    fromDate: 1608069600000,
    toDate: 1609711200000,
  },
];

export const expectedAssignment1 =
  '[{"fromDate":"2020-12-15T22:00:00+00:00","jurisdiction":"7d150b42-11e7-4362-8d0d-1a8ef506c754","organization":"0f38856a-6e0f-5e31-bf3c-a2ad8a53210d","plan":"ae12d8c4-d2a8-53f9-b201-6cccdd42482b","toDate":"2021-01-03T22:00:00+00:00"}]';
