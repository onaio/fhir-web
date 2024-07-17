// eslint-disable @typescript-eslint/no-explicit-any
export const spCheckFlag = {
  resourceType: 'Flag',
  id: '825b5491-9dad-4e28-ad73-521a31193de3',
  meta: {
    versionId: '2',
    lastUpdated: '2024-07-05T14:42:49.003+00:00',
    source: '#1dc83adf808b1de0',
    tag: [
      {
        system: 'https://smartregister.org/app-version',
        code: '1.1.0-eusm',
        display: 'Application Version',
      },
      {
        system: 'https://smartregister.org/organisation-tag-id',
        code: 'd0882d3a-f35a-43cf-9d43-2ea9f9793e24',
        display: 'Practitioner Organization',
      },
      {
        system: 'https://smartregister.org/practitioner-tag-id',
        code: 'ab929110-6918-4d0b-8961-13cce4d5c76b',
        display: 'Practitioner',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        code: 'f15ff8ab-9475-4356-8363-7f518fdd66ce',
        display: 'Practitioner Location',
      },
      {
        system: 'https://smartregister.org/care-team-tag-id',
        code: '4ddd4157-921b-4c65-820c-161b6e845011',
        display: 'Practitioner CareTeam',
      },
    ],
  },
  identifier: [
    {
      value: 'db6ccb63-3012-4143-be21-078345aaca79',
    },
  ],
  status: 'active' as any,
  category: [
    {
      coding: [
        {
          system: 'https://smartregister.org/',
          code: 'SPCHECK',
          display: 'Service Point Check',
        },
      ],
      text: 'Service Point Check',
    },
  ],
  code: {
    coding: [
      {
        system: 'https://smartregister.org/',
        code: '65347579',
        display: 'Vist Flag',
      },
    ],
    text: 'Vist Flag',
  },
  subject: {
    reference: 'Location/20bef46f-b5f2-490f-beca-d9fa6205be06',
  },
  period: {
    start: '2024-04-26T10:48:12+03:00' as any,
    end: '2024-04-26T10:48:12+03:00' as any,
  },
  encounter: {
    reference: 'Encounter/a0c16e6e-b228-4bba-b707-53e484a993f6',
  },
  author: {
    reference: 'Practitioner/ab929110-6918-4d0b-8961-13cce4d5c76b',
  },
};
