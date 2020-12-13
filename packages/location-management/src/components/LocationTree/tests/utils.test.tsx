import * as utils from '../utils';
import { rawHierarchy } from './fixtures';

describe('Location-module/locationunit', () => {
  it('generate treenode from raw data', async () => {
    const x = utils.generateJurisdictionTree(rawHierarchy[2]);

    expect(x).toMatchObject({
      children: [],
      config: {
        childrenPropertyName: 'children',
        modelComparatorFn: undefined,
      },
      model: {
        children: undefined,
        id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
        key: 'Malawi',
        label: 'Malawi',
        node: {
          attributes: {
            geographicLevel: 0,
          },
          locationId: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
          name: 'Malawi',
          voided: false,
        },
        title: 'Malawi',
      },
    });
  });
});
