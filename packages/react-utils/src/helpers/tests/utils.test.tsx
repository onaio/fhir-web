import { intlFormatDateStrings } from '../utils';

test('date formatting works correctly ', () => {
  expect(intlFormatDateStrings('01 Jan 1970 00:00:00 GMT')).toEqual('1/1/1970');
  expect(intlFormatDateStrings('2011-10-10')).toEqual('10/10/2011');
  expect(intlFormatDateStrings('2011-10-10T14:48:00.000+09:00')).toEqual('10/10/2011');
});
