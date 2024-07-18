/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';

export const productGroup: IGroup = {
  resourceType: 'Group',
  id: '03310a5c-7c8f-4338-a2bf-e601bf84327f',
  meta: {
    versionId: '3',
    lastUpdated: '2024-05-29T12:49:24.098+00:00',
    source: '#e5ac81c091215db9',
  },
  identifier: [
    {
      use: 'official',
      value: '12358132134',
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
  name: 'Lenovo laptop 480s',
  characteristic: [
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '67869606',
            display: 'Accountability period (in months)',
          },
        ],
      },
      valueQuantity: {
        value: 36,
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '56758595',
            display: 'Is it being used appropriately? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '56758595-1',
            display: 'Value entered on the Is it being used appropriately? (optional)',
          },
        ],
        text: 'Processor up to 8th Gen Intel Core i7 processor\nOperating System Powered by Windows 10 Pro\nDisplay 14.0"" screen, WQHD (2560x1440), WVA, 700:1 contrast ratio,\n72% gamut\nGraphics Intel UHD Graphics 620 or HD Graphics 620 in processor\nNVIDIA GeForce MX150 2GB\nMemory up to 24GB DDR4-2400\nStorage up to 1TB M.2 PCIe NVMe SSD\nAudio 2x 1W stereo speakers with Dolby Audio Premium\nDual array microphones\nBattery† up to 15.6hrs (57Wh)\nPower Adapter One of the following\n45W USB-C\n65W USB-C\nWeight from 1.32kg (2.9lb)',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '45647484',
            display: 'Is it in good condition? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '45647484-1',
            display: 'Value entered on the Is it in good condition? (optional)',
          },
        ],
        text: 'Processor up to 8th Gen Intel Core i7 processor\nOperating System Powered by Windows 10 Pro\nDisplay 14.0"" screen, WQHD (2560x1440), WVA, 700:1 contrast ratio,\n72% gamut\nGraphics Intel UHD Graphics 620 or HD Graphics 620 in processor\nNVIDIA GeForce MX150 2GB\nMemory up to 24GB DDR4-2400\nStorage up to 1TB M.2 PCIe NVMe SSD\nAudio 2x 1W stereo speakers with Dolby Audio Premium\nDual array microphones\nBattery† up to 15.6hrs (57Wh)\nPower Adapter One of the following\n45W USB-C\n65W USB-C\nWeight from 1.32kg (2.9lb)',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '34536373',
            display: 'Is it there code',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '34536373-1',
            display: 'Value entered on the It is there code',
          },
        ],
        text: 'Processor up to 8th Gen Intel Core i7 processor\nOperating System Powered by Windows 10 Pro\nDisplay 14.0"" screen, WQHD (2560x1440), WVA, 700:1 contrast ratio,\n72% gamut\nGraphics Intel UHD Graphics 620 or HD Graphics 620 in processor\nNVIDIA GeForce MX150 2GB\nMemory up to 24GB DDR4-2400\nStorage up to 1TB M.2 PCIe NVMe SSD\nAudio 2x 1W stereo speakers with Dolby Audio Premium\nDual array microphones\nBattery† up to 15.6hrs (57Wh)\nPower Adapter One of the following\n45W USB-C\n65W USB-C\nWeight from 1.32kg (2.9lb)',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
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
        text: 'It used for collecting data at the centre',
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
        text: 'All parts are working ok. the processing power is good. Power is working ok.',
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
        text: 'Black laptop 10inches screen',
      },
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
        reference: 'Binary/f22f2ca2-fb04-4087-9d90-3b86fa47ba1f',
      },
    },
  ],
};

export const productInventoryGroup: IGroup = {
  resourceType: 'Group',
  id: 'e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
  meta: {
    versionId: '1',
    lastUpdated: '2024-03-25T16:15:32.736+00:00',
    source: '#743734e1801143fc',
  },
  identifier: [
    {
      use: 'secondary',
      type: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: 'PONUM',
            display: 'PO Number',
          },
        ],
        text: 'PO Number',
      },
      value: '123214312',
    },
    {
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: 'SERNUM',
            display: 'Serial Number',
          },
        ],
        text: 'Serial Number',
      },
      value: '989867686',
    },
    {
      use: 'usual',
      value: 'a065c211-cf3e-4b5b-972f-fdac0e45fef7',
    },
  ],
  active: true,
  type: 'substance',
  actual: false,
  code: {
    coding: [
      {
        system: 'http://smartregister.org/',
        code: '78991122',
        display: 'Supply Inventory',
      },
    ],
  },
  name: 'Lenovo laptop 480s',
  characteristic: [
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '33467722',
            display: 'Quantity ',
          },
        ],
      },
      valueQuantity: {
        value: 34,
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: '98734231',
            display: 'Unicef Section',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: 'health',
            display: 'Health',
          },
        ],
        text: 'Health',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '45647484',
            display: 'Donor',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://smartregister.org/',
            code: 'gavi',
            display: 'GAVI',
          },
        ],
        text: 'GAVI',
      },
    },
  ],
  member: [
    {
      entity: {
        reference: 'Group/03310a5c-7c8f-4338-a2bf-e601bf84327f',
      },
      period: {
        start: '2024-02-01T00:00:00.00Z' as any,
        end: '2024-02-01T00:00:00.00Z' as any,
      },
      inactive: false,
    },
  ],
};

export const listBundle: any = {
  resourceType: 'Bundle',
  id: '075975fb-c1a1-47c6-abf7-31b33bc24397',
  meta: {
    lastUpdated: '2024-07-18T05:26:07.421+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://unicef-mg-eusm-preview.smartregister.org/fhir/List/_search?code=http%3A%2F%2Fsmartregister.org%2Fcodes%7C22138876&item=e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://unicef-mg-eusm-preview.smartregister.org/fhir/List/af17fe86-561a-44b0-84d3-5e75c753f6f8',
      resource: {
        resourceType: 'List',
        id: 'af17fe86-561a-44b0-84d3-5e75c753f6f8',
        meta: {
          versionId: '4',
          lastUpdated: '2024-07-03T13:22:08.095+00:00',
          source: '#a6a4e0874a0f2f40',
        },
        identifier: [
          {
            use: 'official',
            value: 'f39c5f68-ab0f-4ae5-a9e2-47b0beb73d8e',
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
        subject: {
          reference: 'Location/20bef46f-b5f2-490f-beca-d9fa6205be06',
        },
        entry: [
          {
            flag: {
              coding: [
                {
                  system: 'http://smartregister.org/',
                  code: '22138876',
                  display: 'Supply Inventory List',
                },
              ],
              text: 'Supply Inventory List',
            },
            date: '2024-02-01T00:00:00.00Z',
            item: {
              reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
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

export const productLocation: ILocation = {
  resourceType: 'Location',
  id: '20bef46f-b5f2-490f-beca-d9fa6205be06',
  meta: {
    versionId: '2',
    lastUpdated: '2024-04-23T13:17:27.569+00:00',
    source: '#894e4c7c9ea5f632',
  },
  identifier: [
    {
      use: 'official',
      value: '20bef46f-b5f2-490f-beca-d9fa6205be06',
    },
  ],
  status: 'active',
  name: 'Yaya Centre',
  alias: ['Yaya Centre'],
  description: 'This is Yaya Centre in kilimani',
  type: [
    {
      coding: [
        {
          system: 'https://smartregister.org/codes/administrative-level',
          code: '3',
          display: 'Level 3',
        },
      ],
    },
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
          code: 'work',
          display: 'Work Site',
        },
      ],
    },
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
          code: 'meah',
          display: 'MEAH',
        },
      ],
    },
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
  position: {
    longitude: 36.787517583606544,
    latitude: -1.2926708714152355,
  },
  partOf: {
    reference: 'Location/25c56dd5-4dca-449d-bf6e-665f90d0ff77',
  },
};

export const productFlag: IFlag = {
  resourceType: 'Flag',
  id: '1a3a0d65-b6ad-40af-b6cd-2e8801614de9',
  meta: {
    versionId: '1',
    lastUpdated: '2024-04-29T20:24:57.887+00:00',
    source: '#de39c0f1b54ecbf8',
    tag: [
      {
        system: 'https://smartregister.org/practitioner-tag-id',
        code: 'ab929110-6918-4d0b-8961-13cce4d5c76b',
        display: 'Practitioner',
      },
      {
        system: 'https://smartregister.org/organisation-tag-id',
        code: 'd0882d3a-f35a-43cf-9d43-2ea9f9793e24',
        display: 'Practitioner Organization',
      },
      {
        system: 'https://smartregister.org/care-team-tag-id',
        code: '4ddd4157-921b-4c65-820c-161b6e845011',
        display: 'Practitioner CareTeam',
      },
      {
        system: 'https://smartregister.org/app-version',
        code: '1.1.0-eusm',
        display: 'Application Version',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        code: 'f15ff8ab-9475-4356-8363-7f518fdd66ce',
        display: 'Practitioner Location',
      },
    ],
  },
  identifier: [
    {
      use: 'usual',
      value: '8561c6bd-5231-4b92-90f0-8505f92d32d2',
    },
  ],
  status: 'active',
  category: [
    {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: 'PRODCHECK',
          display: 'Product Check',
        },
      ],
      text: 'Product Check',
    },
  ],
  code: {
    coding: [
      {
        system: 'http://smartregister.org/',
        code: '65347579',
        display: 'Visit Flag',
      },
    ],
    text: 'Visit Flag',
  },
  subject: {
    reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
  },
  period: {
    start: '2024-04-29T20:37:45+03:00' as any,
  },
  encounter: {
    reference: 'Encounter/eff29c76-2f98-4388-a7e8-878ed321d90e',
  },
  author: {
    reference: 'Practitioner/ab929110-6918-4d0b-8961-13cce4d5c76b',
  },
};

export const createdEncounterProductFlag = {
  resourceType: 'Encounter',
  id: '15e2dd99-91f7-5dc8-b84b-14d546610f3c',
  identifier: [{ use: 'usual', value: 'd8f6bb0d-a2ed-4bee-982b-846845930dbc' }],
  status: 'finished',
  class: {
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    code: 'OBSENC',
    display: 'Observation Encounter',
  },
  type: [
    {
      coding: [
        { system: 'http://smartregister.org/', code: 'SPCHECK', display: 'Service Point Check' },
      ],
      text: 'Service Point Check',
    },
    {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: 'OSRPWEB',
          display: 'OpenSRP web generated Encounter',
        },
      ],
      text: 'OpenSRP web generated Encounter',
    },
  ],
  priority: {
    coding: [
      {
        system: 'http://terminology.hl7.org/ValueSet/v3-ActPriority',
        code: 'EL',
        display: 'elective',
      },
    ],
    text: 'elective',
  },
  participant: [{ individual: { reference: 'Practitioner/practitionerId' } }],
  period: { start: '2023-09-13T03:56:00.000+00:00', end: '2023-09-13T04:20:00.000+00:00' } as any,
  reasonCode: [
    {
      coding: [
        { system: 'http://smartregister.org/', code: 'SPCHECK', display: 'Service Point Check' },
      ],
      text: 'Service Point Check',
    },
  ],
  location: [
    { location: { reference: 'Location/20bef46f-b5f2-490f-beca-d9fa6205be06' }, status: 'active' },
  ],
  partOf: { reference: 'Encounter/eff29c76-2f98-4388-a7e8-878ed321d90e' },
  meta: {
    tag: [
      {
        system: 'https://smartregister.org/practitioner-tag-id',
        code: 'ab929110-6918-4d0b-8961-13cce4d5c76b',
        display: 'Practitioner',
      },
      {
        system: 'https://smartregister.org/organisation-tag-id',
        code: 'd0882d3a-f35a-43cf-9d43-2ea9f9793e24',
        display: 'Practitioner Organization',
      },
      {
        system: 'https://smartregister.org/care-team-tag-id',
        code: '4ddd4157-921b-4c65-820c-161b6e845011',
        display: 'Practitioner CareTeam',
      },
      {
        system: 'https://smartregister.org/app-version',
        code: '1.1.0-eusm',
        display: 'Application Version',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        code: 'f15ff8ab-9475-4356-8363-7f518fdd66ce',
        display: 'Practitioner Location',
      },
    ],
  },
};

export const createdObservationProductFlag = {
  id: 'd15869ed-1ab1-5dc8-b07c-d384bc4ce9b8',
  identifier: [{ use: 'usual', value: 'a065c211-cf3e-4b5b-972f-fdac0e45fef7' }],
  status: 'final',
  category: [
    {
      coding: [
        { system: 'http://smartregister.org/', code: 'SPCHECK', display: 'Service Point Check' },
      ],
      text: 'Service Point Check',
    },
    {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: 'OSRPWEB',
          display: 'OpenSRP web generated Encounter',
        },
      ],
      text: 'OpenSRP web generated Encounter',
    },
  ],
  code: {
    coding: [
      { system: 'http://smartregister.org/', code: '11227899', display: 'Vist Flag Observation' },
    ],
    text: 'Vist Flag Observation',
  },
  subject: { reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66' },
  focus: [
    { reference: 'Location/20bef46f-b5f2-490f-beca-d9fa6205be06' },
    { reference: 'Flag/1a3a0d65-b6ad-40af-b6cd-2e8801614de9' },
  ],
  encounter: { reference: 'Encounter/15e2dd99-91f7-5dc8-b84b-14d546610f3c' },
  effectivePeriod: { start: '2024-02-01T00:00:00.00Z', end: '2024-02-01T00:00:00.00Z' } as any,
  valueCodeableConcept: {
    coding: [
      { system: 'http://snomed.info/sct', code: '373066001', display: 'Yes (qualifier value)' },
    ],
    text: 'Yes (qualifier value)',
  },
  note: [{ text: 'Some comments here' }],
  meta: {
    tag: [
      {
        system: 'https://smartregister.org/practitioner-tag-id',
        code: 'ab929110-6918-4d0b-8961-13cce4d5c76b',
        display: 'Practitioner',
      },
      {
        system: 'https://smartregister.org/organisation-tag-id',
        code: 'd0882d3a-f35a-43cf-9d43-2ea9f9793e24',
        display: 'Practitioner Organization',
      },
      {
        system: 'https://smartregister.org/care-team-tag-id',
        code: '4ddd4157-921b-4c65-820c-161b6e845011',
        display: 'Practitioner CareTeam',
      },
      {
        system: 'https://smartregister.org/app-version',
        code: '1.1.0-eusm',
        display: 'Application Version',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        code: 'f15ff8ab-9475-4356-8363-7f518fdd66ce',
        display: 'Practitioner Location',
      },
    ],
  },
};

export const productUpdatedFlag = {
  ...productFlag,
  status: 'inactive',
};
