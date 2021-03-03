import { quickSort } from '../utils';

describe('tests/utils', () => {
  it('should Sort data with string and numbers', () => {
    const numberArray = [1, 5, 3, 5, 9];
    expect(quickSort(numberArray)).toMatchObject([1, 3, 5, 5, 9]);

    const stringArray = ['Bad', 'Dad', 'Cat', 'Apple', 'Fruit', 'Elephant'];
    expect(quickSort(stringArray)).toMatchObject([
      'Apple',
      'Bad',
      'Cat',
      'Dad',
      'Elephant',
      'Fruit',
    ]);
  });
});
