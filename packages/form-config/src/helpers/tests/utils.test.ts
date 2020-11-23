import { formatDate } from '../utils';

describe('utils/formatDate', () => {
  it('should accept different date formats', () => {
    expect(formatDate('2019-10-20T15:21:50.227+02:00')).toEqual('2019-10-20');
    expect(formatDate('december 18, 2019, 8:45:22 PM')).toEqual('2019-12-18');
  });

  it('should add prefix 0 to days and months less than 10', () => {
    // month
    expect(formatDate('june 18, 2019, 8:45:22 PM')).toEqual('2019-06-18');
    // day
    expect(formatDate('december 8, 2019, 8:45:22 PM')).toEqual('2019-12-08');
    // day and  month
    expect(formatDate('June 8, 2019, 8:45:22 PM')).toEqual('2019-06-08');
  });
});
