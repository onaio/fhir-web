import { render, screen, waitFor } from '@testing-library/react';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { v5 as uuidv5 } from 'uuid';
import { encounter, observation } from '../payloadConfigs';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  EncounterResourceType,
  FlagResourceType,
  ObservationResourceType,
  PractitionerResourceType,
  conceptsHaveCodings,
  consultBeneficiaryCoding,
  servicePointCheckCoding,
} from '@opensrp/fhir-helpers';
import {
  postPutEncounter,
  postPutObservation,
  postPutFlag,
  generateEncounterPayload,
  generateCommonProperties,
  generateObservationPayload,
  putCloseFlagResources,
} from '../utils';
import { flag } from './fixtures';

// Mock the dependencies
jest.mock('@opensrp/react-utils', () => ({
  FHIRServiceClass: jest.fn().mockImplementation(() => ({
    update: jest.fn(),
  })),
}));

jest.mock('uuid', () => ({
  v5: jest.fn().mockReturnValue('mocked-uuid'),
}));

jest.mock('@opensrp/fhir-helpers', () => ({
  ...jest.requireActual('@opensrp/fhir-helpers'),
  conceptsHaveCodings: jest.fn(),
  consultBeneficiaryCoding: 'consultBeneficiaryCoding',
  servicePointCheckCoding: 'servicePointCheckCoding',
}));

describe('Utility functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should generate common properties correctly', () => {
    const resourceType = 'resource';
    const expectedProperties = {
      id: 'mocked-uuid',
      meta: {
        tag: flag.meta?.tag,
      },
    };

    const result = generateCommonProperties(resourceType, flag);

    expect(result).toEqual(expectedProperties);
    expect(uuidv5).toHaveBeenCalledWith(resourceType, flag.id);
  });
  it('should post or put an encounter payload to the FHIR server', async () => {
    const mockUpdate = jest.fn();
    (FHIRServiceClass as jest.Mock).mockImplementation(() => ({
      update: mockUpdate,
    }));
    const baseUrl = 'http://example.com';
    const payload = { id: '1' } as IEncounter;

    await postPutEncounter(baseUrl, payload);
    expect(FHIRServiceClass).toHaveBeenCalledWith(baseUrl, EncounterResourceType);
    expect(mockUpdate).toHaveBeenCalledWith(payload);
  });

  it('should post or put an observation payload to the FHIR server', async () => {
    const mockUpdate = jest.fn();
    (FHIRServiceClass as jest.Mock).mockImplementation(() => ({
      update: mockUpdate,
    }));
    const baseUrl = 'http://example.com';
    const payload = { id: '1' } as IObservation;

    await postPutObservation(baseUrl, payload);
    expect(FHIRServiceClass).toHaveBeenCalledWith(baseUrl, ObservationResourceType);
    expect(mockUpdate).toHaveBeenCalledWith(payload);
  });

  it('should post or put a flag payload to the FHIR server', async () => {
    const mockUpdate = jest.fn();
    (FHIRServiceClass as jest.Mock).mockImplementation(() => ({
      update: mockUpdate,
    }));
    const baseUrl = 'http://example.com';
    const payload = { id: '1' } as IFlag;

    await postPutFlag(baseUrl, payload);
    expect(FHIRServiceClass).toHaveBeenCalledWith(baseUrl, FlagResourceType);
    expect(mockUpdate).toHaveBeenCalledWith(payload);
  });
  it('should generate correct encounter payload with location reference', () => {
    // const conceptsHaveCodings = jest.fn();
    const practitionerId = 'practitioner123';
    const locationReference = 'Location/123';
    const { conceptsHaveCodings } = require('@opensrp/fhir-helpers');

    (conceptsHaveCodings as jest.Mock).mockReturnValue(false);

    const expectedPayload = {
      ...encounter,
      id: 'mocked-uuid',
      meta: {
        tag: flag.meta?.tag,
      },
      resourceType: 'Encounter',
      partOf: { reference: flag?.encounter?.reference },
      location: [{ location: { reference: 'Location/123' }, status: 'active' }],
      participant: [
        {
          individual: {
            reference: 'Practitioner/practitioner123',
          },
        },
      ],
    };

    const result = generateEncounterPayload(
      encounter,
      flag as IFlag,
      practitionerId,
      locationReference
    );
    expect(result).toEqual(expectedPayload);
  });
  it('should generate correct observation payload with location reference', () => {
    const practitionerId = 'practitioner123';
    const locationReference = 'Location/123';
    const values = { comments: 'Test comments', status: 'test status' as any }; // Example CloseFlagFormFields

    (conceptsHaveCodings as jest.Mock).mockReturnValue(false);

    const expectedPayload = {
      ...observation,
      id: 'mocked-uuid',
      meta: {
        tag: flag.meta?.tag,
      },
      subject: { reference: flag.subject?.reference },
      encounter: { reference: 'Encounter/mocked-uuid' },
      focus: [{ reference: 'Location/123' }, { reference: `Flag/${flag.id}` }],
      performer: undefined,
      note: [{ text: 'Test comments' }],
    };

    const result = generateObservationPayload(
      observation,
      flag,
      practitionerId,
      locationReference,
      values
    );

    expect(result).toEqual(expectedPayload);
    expect(conceptsHaveCodings).toHaveBeenCalledWith(flag.category, [
      servicePointCheckCoding,
      consultBeneficiaryCoding,
    ]);
  });

  it('should generate correct observation payload with performer and focus flag reference', () => {
    const practitionerId = 'practitioner123';
    const locationReference = 'Location/123';
    const values = { comments: 'Test comments', status: 'active' as any }; // Example CloseFlagFormFields

    (conceptsHaveCodings as jest.Mock).mockReturnValue(true);

    const expectedPayload = {
      ...observation,
      id: 'mocked-uuid',
      meta: {
        tag: flag.meta?.tag,
      },
      subject: { reference: flag.subject?.reference },
      encounter: { reference: 'Encounter/mocked-uuid' },
      focus: [{ reference: `Flag/1a3a0d65-b6ad-40af-b6cd-2e8801614de9` }],
      performer: [{ reference: `Practitioner/practitioner123` }],
      note: [{ text: 'Test comments' }],
    };

    const result = generateObservationPayload(
      observation,
      flag,
      practitionerId,
      locationReference,
      values
    );

    expect(result).toEqual(expectedPayload);
    expect(conceptsHaveCodings).toHaveBeenCalledWith(flag.category, [
      servicePointCheckCoding,
      consultBeneficiaryCoding,
    ]);
  });
});
