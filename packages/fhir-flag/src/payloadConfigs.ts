import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';

export const encounter: IEncounter = {
  resourceType: 'Encounter',
  id: 'd8f6bb0d-a2ed-4bee-982b-846845930dbc',
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
        {
          system: 'http://smartregister.org/',
          code: 'SPCHECK',
          display: 'Service Point Check',
        },
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
  participant: [
    {
      individual: {
        reference: 'Practitioner/631f2c90-43cc-4ae3-a3a5-c539dff7bc3c',
      },
    },
  ],
  period: {
    start: '2023-09-13T03:56:00.000+00:00' as any,
    end: '2023-09-13T04:20:00.000+00:00' as any,
  },
  reasonCode: [
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
  location: [
    {
      location: {
        reference: 'Location/493f46d8-6dfe-4505-ab63-9d78c789400e',
      },
      status: 'active',
    },
  ],
  partOf: { reference: 'Encounter/2492dd29-81bf-4628-96cd-f747f48d7e16' },
};

export const observation: IObservation = {
  resourceType: 'Observation',
  id: 'a065c211-cf3e-4b5b-972f-fdac0e45fef7',
  identifier: [{ use: 'usual', value: 'a065c211-cf3e-4b5b-972f-fdac0e45fef7' }],
  status: 'final',
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
      {
        system: 'http://smartregister.org/',
        code: '11227899',
        display: 'Vist Flag Observation',
      },
    ],
    text: 'Vist Flag Observation',
  },
  subject: { reference: 'Location/6f3980e0-d1d6-4a7a-a950-939f3ca7b301' },
  focus: [{ reference: 'Flag/6f3980e0-d1d6-4a7a-a950-939f3ca7b301' }],
  encounter: { reference: 'Encounter/6f3980e0-d1d6-4a7a-a950-939f3ca7b301' },
  effectivePeriod: {
    start: '2024-02-01T00:00:00.00Z' as any,
    end: '2024-02-01T00:00:00.00Z' as any,
  },
  performer: [{ reference: 'Practitioner/6f3980e0-d1d6-4a7a-a950-939f3ca7b301' }],
  valueCodeableConcept: {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '373066001',
        display: 'Yes (qualifier value)',
      },
    ],
    text: 'Yes (qualifier value)',
  },
  note: [{ time: '2024-02-01T00:00:00.00Z' as any, text: 'Please enter fixed reason' }],
};
