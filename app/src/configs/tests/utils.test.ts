import { setEnv } from '../utils';
import { DISABLE_TEAM_MEMBER_REASSIGNMENT } from '../env';

describe('setEnv util function', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clears cache
    process.env = { ...OLD_ENV }; // Make copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('picks the test .env file', () => {
    let getGeoLevel = Number(setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '0'));
    // expect the value in the .env.test
    expect(getGeoLevel).toEqual(1);
  });
  it('sets an env var value to integer type', () => {
    // defaults to string
    let getGeoLevel = setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '0');
    expect(typeof getGeoLevel).toEqual('string');
    // sets to number
    getGeoLevel = Number(setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '0'));
    expect(typeof getGeoLevel).toEqual('number');
  });
  it('disable team member reassignment defaults to true', () => {
    // matches .env.test (REACT_APP_DISABLE_TEAM_MEMBER_REASSIGNMENT=false)
    expect(DISABLE_TEAM_MEMBER_REASSIGNMENT).toStrictEqual(false);
    // remove var from env (simulate not set)
    delete process.env.REACT_APP_DISABLE_TEAM_MEMBER_REASSIGNMENT;
    // require again - to force re-evaluation after delete
    const actual = jest.requireActual('../env').DISABLE_TEAM_MEMBER_REASSIGNMENT;
    // expect default true if not set
    expect(actual).toStrictEqual(true);
  });
});
