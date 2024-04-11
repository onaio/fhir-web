import { getResourceType } from '../utils';
import { parentNode1, parentNode2 } from './fixtures';

test('generateLocationUnit works correctly', () => {
  const parentId = 'Location/1234';

  // No parent ID
  expect(getResourceType()).toEqual({
    code: '0',
    display: 'Level 0',
    system: 'https://smartregister.org/CodeSystem/administrative-level',
  });

  // Has parent id and parentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(parentNode1 as any, parentId)).toEqual({
    system: 'https://smartregister.org/CodeSystem/administrative-level',
    code: '2',
    display: 'Level 2',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(parentNode1 as any, parentId)).toEqual({
    system: 'https://smartregister.org/CodeSystem/administrative-level',
    code: '2',
    display: 'Level 2',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(parentNode2 as any, parentId)).toEqual({
    system: 'https://smartregister.org/CodeSystem/administrative-level',
    code: '3',
    display: 'Level 3',
  });
});
