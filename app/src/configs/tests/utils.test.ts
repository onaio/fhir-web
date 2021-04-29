import { setEnv } from '../utils';

jest.mock('../env');

describe('setEnv util function', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('correctly sets ent vars', () => {
    const envModule = require('../env');
    envModule.ENABLE_LOCATIONS = true;
    const enableLocations = setEnv('REACT_APP_ENABLE_LOCATIONS', 'false');
    expect(enableLocations).toEqual('true');
  });
  it('sets an env var value to integer type', () => {
    const envModule = require('../env');
    envModule.PLAN_ASSIGNMENT_AT_GEO_LEVEL = '1';
    let getGeoLevel = setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '1', true);
    expect(typeof getGeoLevel).toEqual('number');
    getGeoLevel = setEnv('REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL', '1', false);
    expect(typeof getGeoLevel).toEqual('string');
  });
});
