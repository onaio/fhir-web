import { setEnv } from '../utils';

jest.mock('../env');

describe('setEnv util function', () => {
  it('picks the test .env file', () => {
    let getGeoLevel = Number(setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '0'));
    // expect the value in the .env.test
    expect(getGeoLevel).toEqual(1);
  });
  it('sets an env var value to integer type', () => {
    const envModule = require('../env');
    envModule.PLAN_ASSIGNMENT_AT_GEO_LEVEL = 1;
    let getGeoLevel = Number(setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '1'));
    expect(typeof getGeoLevel).toEqual('number');
    getGeoLevel = setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '1');
    expect(typeof getGeoLevel).toEqual('string');
  });
});
