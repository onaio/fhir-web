import { cloneDeep } from 'lodash';
import { firstTwentyEusmCommodities } from '../../components/CommodityList/Eusm/tests/fixtures';
import { getCharacteristicWithCoding, photoUploadCharacteristicCoding } from '../utils';

test('get characteristic with provided coding works correctly', () => {
  const groupResource = cloneDeep(firstTwentyEusmCommodities.entry[0].resource);

  const character = getCharacteristicWithCoding(
    groupResource.characteristic,
    photoUploadCharacteristicCoding
  );

  expect(character).toEqual(groupResource.characteristic[5]);
});
