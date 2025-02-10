import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import dayjs from 'dayjs';

export const productQuantity = 32;
export const mockResourceId = '67bb848e-f049-41f4-9c75-3b726664db67';
export const servicePointId = '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d';
export const mockProductId = '6f3980e0-d1d6-4a7a-a950-939f3ca7b301';
export const mockUnicefSection =
  '{"code":"ANC.End.26","display":"No complications","system":"http://smartregister.org/CodeSystem/eusm-unicef-sections"}';
export const mockDonorOption =
  '{"code":"ANC.donor","display":"Donor","system":"http://smartregister.org/CodeSystem/eusm-donors"}';
export const servicePointDatum = {
  id: servicePointId,
  name: 'Service Point',
};

export const unicefValuesetConcept = {
  system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
  code: 'ANC.End.26',
  display: 'No complications',
};

export const donorValuesetConcept = {
  system: 'http://smartregister.org/CodeSystem/eusm-donors',
  code: 'ANC.donor',
  display: 'Donor',
};

export const expandedValueSets = {
  resourceType: 'ValueSet',
  id: '2826',
  url: 'http://fhir.org/guides/who/anc-cds/ValueSet/anc-end-26',
  status: 'active',
  compose: {
    include: [
      {
        system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
        concept: [
          {
            code: 'ANC.End.26',
            display: 'No complications',
          },
          {
            code: 'ANC.End.27',
            display: 'Postpartum haemorrhage',
          },
        ],
      },
    ],
  },
  expansion: {
    offset: 0,
    parameter: [
      {
        name: 'offset',
        valueInteger: 0,
      },
      {
        name: 'count',
        valueInteger: 1000,
      },
    ],
    contains: [unicefValuesetConcept],
  },
} as IValueSet;

export const productCharacteristics = [
  {
    code: {
      coding: [
        {
          code: '98734231',
          display: 'Unicef Section',
          system: 'http://smartregister.org/codes',
        },
      ],
    },
    valueCodeableConcept: {
      coding: [
        {
          code: 'ANC.End.26',
          display: 'No complications',
          system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
        },
      ],
      text: 'No complications',
    },
  },
  {
    code: {
      coding: [
        {
          code: '45981276',
          display: 'Donor',
          system: 'http://smartregister.org/codes',
        },
      ],
    },
    valueCodeableConcept: {
      coding: [
        {
          code: 'ANC.donor',
          display: 'Donor',
          system: 'http://smartregister.org/CodeSystem/eusm-donors',
        },
      ],
      text: 'Donor',
    },
  },
  {
    code: {
      coding: [
        {
          code: '33467722',
          display: 'Quantity',
          system: 'http://smartregister.org/codes',
        },
      ],
    },
    valueQuantity: {
      value: productQuantity,
    },
  },
];

export const formValues = {
  product: mockProductId,
  quantity: productQuantity,
  deliveryDate: dayjs('2024-03-25T08:24:51.149Z'),
  accountabilityEndDate: dayjs('2024-03-26T08:24:53.645Z'),
  unicefSection: mockUnicefSection,
  donor: mockDonorOption,
  poNumber: '12345',
  serialNumber: '890',
};

export const locationResourcePayload = {
  resourceType: 'Group',
  id: mockResourceId,
  active: true,
  actual: false,
  type: 'substance',
  meta: {
    tag: [
      {
        code: 'service-point-id',
        display: 'Related Entity Location',
        system: 'https://smartregister.org/related-entity-location-tag-id',
      },
      {
        code: 'service-point-id',
        display: 'Practitioner Location',
        system: 'https://smartregister.org/location-tag-id',
      },
    ],
  },

  identifier: [
    {
      use: 'secondary',
      type: {
        coding: [
          {
            system: 'http://smartregister.org/codes',
            code: 'PONUM',
            display: 'PO Number',
          },
        ],
        text: 'PO Number',
      },
      value: '12345',
    },
    {
      type: {
        coding: [
          {
            code: 'SERNUM',
            display: 'Serial Number',
            system: 'http://smartregister.org/codes',
          },
        ],
        text: 'Serial Number',
      },
      use: 'official',
      value: '890',
    },
  ],
  member: [
    {
      entity: {
        reference: 'Group/6f3980e0-d1d6-4a7a-a950-939f3ca7b301',
      },
      period: {
        start: '2024-03-25T08:24:51.149Z',
        end: '2024-03-26T08:24:53.645Z',
      },
      inactive: false,
    },
  ],
  characteristic: productCharacteristics,
  code: {
    coding: [
      {
        system: 'http://smartregister.org/codes',
        code: '78991122',
        display: 'Supply Inventory',
      },
    ],
  },
};

export const locationInventoryList = {
  resourceType: 'List',
  id: '67bb848e-f049-41f4-9c75-3b726664db67',
  identifier: [{ use: 'official', value: '67bb848e-f049-41f4-9c75-3b726664db67' }],
  status: 'current',
  code: {
    coding: [
      {
        system: 'http://smartregister.org/codes',
        code: '22138876',
        display: 'Supply Inventory List',
      },
    ],
    text: 'Supply Inventory List',
  },
  meta: {
    tag: [
      {
        system: 'https://smartregister.org/related-entity-location-tag-id',
        display: 'Related Entity Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        display: 'Practitioner Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
    ],
  },
  entry: [
    {
      flag: {
        coding: [
          {
            system: 'http://smartregister.org/codes',
            code: '22138876',
            display: 'Supply Inventory List',
          },
        ],
        text: 'Supply Inventory List',
      },
      date: '2017-07-13T19:31:00.000Z',
      item: { reference: 'Group/67bb848e-f049-41f4-9c75-3b726664db67' },
    },
  ],
  title: 'Service Point',
  subject: { reference: 'Location/46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d' },
};

export const locationInventoryList1384 = {
  resourceType: 'List',
  id: '9f4edfe3-ac84-449f-8640-f0d297e75ff5',
  identifier: [{ use: 'official', value: '9f4edfe3-ac84-449f-8640-f0d297e75ff5' }],
  status: 'current',
  code: {
    coding: [
      {
        system: 'http://smartregister.org/codes',
        code: '22138876',
        display: 'Supply Inventory List',
      },
    ],
    text: 'Supply Inventory List',
  },
  title: 'Service Point',
  subject: { reference: 'Location/46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d' },
  entry: [
    {
      flag: {
        coding: [
          {
            system: 'http://smartregister.org/codes',
            code: '22138876',
            display: 'Supply Inventory List',
          },
        ],
        text: 'Supply Inventory List',
      },
      date: '2017-07-13T19:31:00.000Z',
      item: { reference: 'Group/722cd036-3036-43d6-85e0-d25b22216764' },
    },
  ],
};

export const locationInventoryList1384Bundle = {
  resourceType: 'Bundle',
  id: 'df796c9e-002c-47ff-a88f-6b86edca9262',
  meta: {
    lastUpdated: '2024-04-03T07:56:54.936+00:00',
  },
  type: 'searchset',
  total: 1,
  entry: [
    {
      resource: locationInventoryList1384,
      search: {
        mode: 'match',
      },
    },
  ],
};

export const updatedLocationInventoryList1 = {
  resourceType: 'List',
  id: '9f4edfe3-ac84-449f-8640-f0d297e75ff5',
  identifier: [{ use: 'official', value: '9f4edfe3-ac84-449f-8640-f0d297e75ff5' }],
  status: 'current',
  code: {
    coding: [
      {
        system: 'http://smartregister.org/codes',
        code: '22138876',
        display: 'Supply Inventory List',
      },
    ],
    text: 'Supply Inventory List',
  },
  meta: {
    tag: [
      {
        system: 'https://smartregister.org/related-entity-location-tag-id',
        display: 'Related Entity Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        display: 'Practitioner Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
    ],
  },
  entry: [
    {
      flag: {
        coding: [
          {
            system: 'http://smartregister.org/codes',
            code: '22138876',
            display: 'Supply Inventory List',
          },
        ],
        text: 'Supply Inventory List',
      },
      date: '2017-07-13T19:31:00.000Z',
      item: { reference: 'Group/722cd036-3036-43d6-85e0-d25b22216764' },
    },
    {
      flag: {
        coding: [
          {
            system: 'http://smartregister.org/codes',
            code: '22138876',
            display: 'Supply Inventory List',
          },
        ],
        text: 'Supply Inventory List',
      },
      date: '2017-07-13T19:31:00.000Z',
      item: { reference: 'Group/67bb848e-f049-41f4-9c75-3b726664db67' },
    },
  ],
  title: 'Service Point',
  subject: { reference: 'Location/46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d' },
};

export const allInventoryList = {
  resourceType: 'List',
  id: 'list-resource-id',
  identifier: [{ use: 'official', value: 'list-resource-id' }],
  status: 'current',
  code: {
    coding: [
      {
        system: 'http://smartregister.org/codes',
        code: '22138876',
        display: 'Supply Inventory List',
      },
    ],
    text: 'Supply Inventory List',
  },
  mode: 'working',
  title: 'Supply Chain commodities',
  entry: [
    { item: { reference: 'Group/67bb848e-f049-41f4-9c75-3b726664db67' } },
    { item: { reference: 'List/67bb848e-f049-41f4-9c75-3b726664db67' } },
  ],
};

export const productsList = {
  resourceType: 'Bundle',
  id: 'df796c9e-002c-47ff-a88f-6b86edca9262',
  meta: {
    lastUpdated: '2024-04-03T07:56:54.936+00:00',
  },
  type: 'searchset',
  total: 6,
  link: [
    {
      relation: 'self',
      url: 'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/_search?_count=20&_getpagesoffset=0&_has%3AList%3Aitem%3A_id=ea15c35a-8e8c-47ce-8122-c347cefa1b4a&code=http%3A%2F%2Fsnomed.info%2Fsct%7C386452003',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/5421983c-6701-4ecc-820d-3d9f3da77829',
      resource: {
        resourceType: 'Group',
        id: '5421983c-6701-4ecc-820d-3d9f3da77829',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-27T14:30:25.701+00:00',
          source: '#0046f4275e77e281',
        },
        identifier: [
          {
            use: 'official',
            value: '585895',
          },
        ],
        active: true,
        type: 'substance',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Yellow sunshine',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 24,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: 'Yellow sunshine',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: 'Sunshine',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'Yelllow',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: false,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/7c5445cc-8bc8-4545-86b0-f36f46e3e631',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/d538bfbd-5f35-47ec-b54f-63bb98cba83e',
      resource: {
        resourceType: 'Group',
        id: 'd538bfbd-5f35-47ec-b54f-63bb98cba83e',
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-27T14:37:23.892+00:00',
          source: '#745956222c5d8747',
        },
        identifier: [
          {
            use: 'official',
            value: '678899',
          },
        ],
        active: true,
        type: 'device',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Fig tree',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 12,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: 'The tree provides a shade',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: 'All leaves are intact....',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'It is green and straight',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: true,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/cdf20d3a-4cdc-479f-bd89-b6d4ba614fa3',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/19571c2b-c0e7-4abb-90da-a6a9a3d38a24',
      resource: {
        resourceType: 'Group',
        id: '19571c2b-c0e7-4abb-90da-a6a9a3d38a24',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-27T15:10:25.788+00:00',
          source: '#9730c4d2c34ea089',
        },
        identifier: [
          {
            use: 'official',
            value: '3868696',
          },
        ],
        active: true,
        type: 'substance',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Lumpy nuts',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 6,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: true,
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/c8ccbac8-ef33-4c3a-b209-ab9047e7bb13',
      resource: {
        resourceType: 'Group',
        id: 'c8ccbac8-ef33-4c3a-b209-ab9047e7bb13',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-27T15:12:12.796+00:00',
          source: '#b7a6880d7abb2e21',
        },
        identifier: [
          {
            use: 'official',
            value: '677889',
          },
        ],
        active: true,
        type: 'medication',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Happy Feet',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 24,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: '.',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: true,
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/03a19f4e-712e-4436-868b-f6814f2f601b',
      resource: {
        resourceType: 'Group',
        id: '03a19f4e-712e-4436-868b-f6814f2f601b',
        meta: {
          versionId: '2',
          lastUpdated: '2024-04-02T07:25:37.804+00:00',
          source: '#5ef74a9b63ccaf71',
        },
        identifier: [
          {
            use: 'official',
            value: '56dtdhdh',
          },
        ],
        active: true,
        type: 'medication',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Lilly Flowers',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 6,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: 'Test',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: 'Test',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'Test',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: false,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/f9b34d49-dc7f-4665-9332-34481d2c3e27',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/Group/77d1a095-7bb1-400b-8018-39833a3328c4',
      resource: {
        resourceType: 'Group',
        id: '77d1a095-7bb1-400b-8018-39833a3328c4',
        meta: {
          versionId: '3',
          lastUpdated: '2024-04-02T08:23:12.026+00:00',
          source: '#f504e8a8c4ee5c90',
        },
        identifier: [
          {
            use: 'official',
            value: '1111',
          },
        ],
        active: true,
        type: 'device',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Smartphone TEST',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 37,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'TEST',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: false,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/d291217a-f3df-4515-9d44-5f8b48b62482',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const unicefSectionValueSet = {
  resourceType: 'ValueSet',
  id: 'eusm-unicef-sections',
  meta: {
    extension: [
      {
        url: 'http://hapifhir.io/fhir/StructureDefinition/valueset-expansion-message',
        valueString:
          'ValueSet was expanded using an expansion that was pre-calculated at 2024-04-03T09:41:34.832+00:00 (00:33:04 ago)',
      },
    ],
    versionId: '3',
  },
  url: 'http://smartregister.org/ValueSet/eusm-unicef-sections',
  status: 'active',
  compose: {
    include: [
      {
        system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
        concept: [
          {
            code: 'health',
            display: 'Health',
          },
          {
            code: 'wash',
            display: 'WASH',
          },
        ],
      },
    ],
  },
  expansion: {
    identifier: '0f8081e7-3e92-47a5-808c-ee2fc28db72b',
    timestamp: '2024-04-03T10:14:39+00:00',
    total: 0,
    offset: 0,
    parameter: [
      {
        name: 'offset',
        valueInteger: 0,
      },
      {
        name: 'count',
        valueInteger: 1000,
      },
    ],
  },
};

export const unicefDonorsValueSet = {
  resourceType: 'ValueSet',
  id: 'eusm-donors',
  meta: {
    extension: [
      {
        url: 'http://hapifhir.io/fhir/StructureDefinition/valueset-expansion-message',
        valueString:
          'ValueSet was expanded using an expansion that was pre-calculated at 2024-04-03T09:49:53.280+00:00 (00:26:07 ago)',
      },
    ],
    versionId: '3',
  },
  url: 'http://smartregister.org/ValueSet/eusm-donors',
  status: 'active',
  compose: {
    include: [
      {
        system: 'http://smartregister.org/CodeSystem/eusm-donors',
        concept: [
          {
            code: 'adb',
            display: 'ADB',
          },
          {
            code: 'natcom belgium',
            display: 'NatCom Belgium',
          },
          {
            code: 'bmgf',
            display: 'BMGF',
          },
        ],
      },
    ],
  },
  expansion: {
    identifier: 'adbcad78-0ad0-4555-a7dc-cc252ff96bda',
    timestamp: '2024-04-03T10:16:01+00:00',
    total: 0,
    offset: 0,
    parameter: [
      {
        name: 'offset',
        valueInteger: 0,
      },
      {
        name: 'count',
        valueInteger: 1000,
      },
    ],
  },
};

export const createdInventoryGroup1 = {
  meta: {
    tag: [
      {
        system: 'https://smartregister.org/related-entity-location-tag-id',
        display: 'Related Entity Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        display: 'Practitioner Location',
        code: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      },
    ],
  },
  resourceType: 'Group',
  id: '67bb848e-f049-41f4-9c75-3b726664db67',
  active: true,
  actual: false,
  type: 'substance',
  identifier: [
    {
      use: 'secondary',
      type: {
        coding: [{ system: 'http://smartregister.org/codes', code: 'PONUM', display: 'PO Number' }],
        text: 'PO Number',
      },
      value: '578643',
    },
    {
      use: 'official',
      type: {
        coding: [
          { system: 'http://smartregister.org/codes', code: 'SERNUM', display: 'Serial Number' },
        ],
        text: 'Serial Number',
      },
      value: 'yk254',
    },
  ],
  member: [
    {
      entity: { reference: 'Group/19571c2b-c0e7-4abb-90da-a6a9a3d38a24' },
      period: { start: '2024-03-25T08:24:51.149Z', end: '2024-03-26T08:24:53.645Z' },
      inactive: false,
    },
  ],
  characteristic: [
    {
      code: {
        coding: [
          { system: 'http://smartregister.org/codes', code: '98734231', display: 'Unicef Section' },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            code: 'health',
            display: 'Health',
            system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
          },
        ],
        text: 'Health',
      },
    },
    {
      code: {
        coding: [{ system: 'http://smartregister.org/codes', code: '45981276', display: 'Donor' }],
      },
      valueCodeableConcept: {
        coding: [
          {
            code: 'adb',
            display: 'ADB',
            system: 'http://smartregister.org/CodeSystem/eusm-donors',
          },
        ],
        text: 'ADB',
      },
    },
    {
      code: {
        coding: [
          { system: 'http://smartregister.org/codes', code: '33467722', display: 'Quantity' },
        ],
      },
      valueQuantity: { value: '20' },
    },
  ],
  code: {
    coding: [
      { system: 'http://smartregister.org/codes', code: '78991122', display: 'Supply Inventory' },
    ],
  },
};
