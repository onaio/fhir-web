import { defaultFormField, getResourceType } from '../utils';
import { parentNode1, parentNode2 } from './fixtures';

test('generateLocationUnit works correctly', () => {
  const parentId = 'Location/1234';
  const id = 'loc-resource-id';
  const initialType = [
    {
      coding: [
        {
          system: 'https://smartregister.org/codes',
          code: 'code',
          display: 'Test code',
        },
      ],
    },
    {
      coding: [
        {
          system: 'https://smartregister.org/CodeSystem/administrative-level',
          code: '2',
          display: 'Level 2',
        },
      ],
    },
  ];

  // No parent ID
  expect(getResourceType(defaultFormField)).toEqual({
    type: [
      {
        coding: [
          {
            system: 'https://smartregister.org/CodeSystem/administrative-level',
            code: '0',
            display: 'Level 0',
          },
        ],
      },
    ],
  });

  // Has parent id and parentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(defaultFormField, parentNode1 as any, parentId)).toEqual({
    type: [
      {
        coding: [
          {
            system: 'https://smartregister.org/CodeSystem/administrative-level',
            code: '2',
            display: 'Level 2',
          },
        ],
      },
    ],
  });

  // Edit and no initial types
  defaultFormField.id = id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(defaultFormField, parentNode1 as any, parentId)).toEqual({
    type: [
      {
        coding: [
          {
            system: 'https://smartregister.org/CodeSystem/administrative-level',
            code: '2',
            display: 'Level 2',
          },
        ],
      },
    ],
  });

  // Edit with type and parent ids are equal
  defaultFormField.id = id;
  defaultFormField.parentId = parentId;
  defaultFormField.type = initialType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(defaultFormField, parentNode1 as any, parentId)).toEqual({
    type: initialType,
  });

  // Edit Parent ids not Equal
  defaultFormField.parentId = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(getResourceType(defaultFormField, parentNode2 as any, parentId)).toEqual({
    type: [
      initialType[0],
      {
        coding: [
          {
            system: 'https://smartregister.org/CodeSystem/administrative-level',
            code: '3',
            display: 'Level 3',
          },
        ],
      },
    ],
  });
});
