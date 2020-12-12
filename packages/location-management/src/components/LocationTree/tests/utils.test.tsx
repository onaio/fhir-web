import * as utils from '../utils';
import * as fixtures from './fixtures';

describe('Location-module/locationunit', () => {
  it('generate treenode from raw data', async () => {
    let x = utils.generateJurisdictionTree(fixtures.rawHierarchy[0]);
    expect(x).toMatchObject(fixtures.parsedHierarchy[0]);
  });
});
