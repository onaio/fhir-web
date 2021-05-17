import { generateJurisdictionTree } from '@opensrp/location-management';
import { getCords, getNodePath } from '../utils';
import { geographicHierarchy, madagascarTree, structure2 } from './fixtures';

it('branch test for getNodePath with parentId undefined', async () => {
  const sampleLocation = {
    ...structure2,
    properties: { ...structure2.properties, parentId: undefined },
  };
  const res = getNodePath(sampleLocation, [generateJurisdictionTree(madagascarTree)]);
  expect(res).toEqual([]);
});

it('branch test for getNodePath with parentId', async () => {
  const sampleLocation = {
    ...structure2,
    properties: { ...structure2.properties, parentId: 'b8a7998c-5df6-49eb-98e6-f0675db71848' },
  };
  const res = getNodePath(sampleLocation, [generateJurisdictionTree(madagascarTree)]);
  expect(res).toEqual(geographicHierarchy);
});

it('test for getCords', async () => {
  const res = getCords({
    type: 'Point',
    coordinates: [49.52125, -16.78147],
  });
  expect(res).toEqual({ lat: -16.78147, lng: 49.52125 });
  expect(getCords()).toEqual({});
});
