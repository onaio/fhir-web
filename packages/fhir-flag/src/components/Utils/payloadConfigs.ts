/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';

export const encounter: IEncounter = {
  resourceType: 'Encounter',
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
};

export const observation: IObservation = {
  resourceType: 'Observation',
  id: 'a065c211-cf3e-4b5b-972f-fdac0e45fef7',
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
  effectivePeriod: {
    start: '2024-02-01T00:00:00.00Z' as any,
    end: '2024-02-01T00:00:00.00Z' as any,
  },
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
};
