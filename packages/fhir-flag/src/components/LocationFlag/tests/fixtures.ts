/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const spCheckFlag: IFlag = {
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
          system: 'http://smartregister.org/',
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
        system: 'http://smartregister.org/',
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

export const location: ILocation = {
  resourceType: 'Location',
  id: 'c9720e56-4b77-4871-bef5-b4dd978626c9',
  meta: {
    versionId: '1',
    lastUpdated: '2024-07-09T02:32:32.026+00:00',
    source: '#3dd7a2df5461c2ee',
  },
  status: 'active',
  name: 'New SP Test',
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
    {
      coding: [
        {
          system: 'http://smartregister.org/CodeSystem/eusm-service-point-type',
          code: 'ecole privé',
          display: 'Ecole privé',
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
  partOf: {
    reference: 'Location/d46e825e-2af8-423b-aaec-bd8aeeb27da7',
    display: 'Fenerive est',
  },
};

export const encounterBodyLocationFlag = {
  resourceType: 'Encounter',
  id: '7892014e-56d7-53c1-9df0-b4642dba2486',
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
  period: { start: '2023-09-13T03:56:00.000+00:00', end: '2023-09-13T04:20:00.000+00:00' },
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
  partOf: { reference: 'Encounter/a0c16e6e-b228-4bba-b707-53e484a993f6' },
  meta: {
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
};

export const locationUpdatedFlag = {
  ...spCheckFlag,
  status: 'inactive' as any,
};

export const createdObservationLocationFlag = {
  resourceType: 'Observation',
  id: '5e524254-80f9-5d96-bcde-0e28d72f7aff',
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
  subject: { reference: 'Location/20bef46f-b5f2-490f-beca-d9fa6205be06' },
  focus: [{ reference: 'Flag/825b5491-9dad-4e28-ad73-521a31193de3' }],
  encounter: { reference: 'Encounter/7892014e-56d7-53c1-9df0-b4642dba2486' },
  effectivePeriod: { start: '2024-02-01T00:00:00.00Z', end: '2024-02-01T00:00:00.00Z' },
  performer: [{ reference: 'Practitioner/practitionerId' }],
  valueCodeableConcept: {
    coding: [
      { system: 'http://snomed.info/sct', code: '373066001', display: 'Yes (qualifier value)' },
    ],
    text: 'Yes (qualifier value)',
  },
  note: [{ text: 'Some comments here', time: '2017-07-13T19:31:00.000Z' }],
  meta: {
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
};
