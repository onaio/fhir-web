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
          display: 'Quantity ',
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
  identifier: [
    {
      use: 'official',
      value: '67bb848e-f049-41f4-9c75-3b726664db67',
    },
  ],
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
  subject: {
    reference: `Location/${servicePointId}`,
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
      date: '2024-03-25T17:40:23.971Z',
      item: {
        reference: `Group/${mockResourceId}`,
      },
    },
  ],
};

export const locationServicePointList = {
  resourceType: 'List',
  id: 'list-resource-id',
  identifier: [
    {
      use: 'official',
      value: 'list-resource-id',
    },
  ],
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
  entry: [],
};
