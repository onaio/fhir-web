import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { v5 } from 'uuid';
import { encounter, observation } from './payloadConfigs';
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

export interface CloseFlagFormFields {
  productName?: string;
  locationName?: string;
  status: IFlag['status'];
  comments?: string;
  listSubject?: string;
  practitionerId?: string;
}

// Utility function to generate common properties
export const generateCommonProperties = (id: string, flag: IFlag) => ({
  id: v5(id, flag.id as string),
  meta: {
    tag: flag.meta?.tag,
  },
});

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the encounter payload
 */
export const postPutEncounter = (baseUrl: string, payload: IEncounter) => {
  const serve = new FHIRServiceClass<IEncounter>(baseUrl, EncounterResourceType);
  return serve.update(payload);
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the observation payload
 */
export const postPutObservation = (baseUrl: string, payload: IObservation) => {
  const serve = new FHIRServiceClass<IObservation>(baseUrl, ObservationResourceType);
  return serve.update(payload);
};

/**
 * puts a flag resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the flag payload
 */
export const postPutFlag = (baseUrl: string, payload: IFlag) => {
  const serve = new FHIRServiceClass<IFlag>(baseUrl, FlagResourceType);
  return serve.update(payload);
};

export const generateEncounterPayload = (
  encounter: IEncounter,
  flag: IFlag,
  practitionerId: string,
  locationReference: string
) => {
  const commonProperties = generateCommonProperties(EncounterResourceType, flag);
  const reference = conceptsHaveCodings(flag.category, [
    servicePointCheckCoding,
    consultBeneficiaryCoding,
  ])
    ? flag.subject.reference
    : locationReference;

  return {
    ...encounter,
    ...commonProperties,
    partOf: { reference: flag?.encounter?.reference },
    location: [{ location: { reference }, status: 'active' }],
    participant: [
      {
        individual: {
          reference: `${PractitionerResourceType}/${practitionerId}`,
        },
      },
    ],
  };
};

export const generateObservationPayload = (
  observation: IObservation,
  flag: IFlag,
  practitionerId: string,
  locationReference: string,
  values: CloseFlagFormFields
) => {
  const commonProperties = generateCommonProperties(ObservationResourceType, flag);
  const encounterProperties = generateCommonProperties(EncounterResourceType, flag);
  const isSPCHECKOrCNBEN = conceptsHaveCodings(flag.category, [
    servicePointCheckCoding,
    consultBeneficiaryCoding,
  ]);

  return {
    ...observation,
    ...commonProperties,
    subject: { reference: flag.subject?.reference },
    encounter: { reference: `Encounter/${encounterProperties.id}` },
    focus: isSPCHECKOrCNBEN
      ? [{ reference: `Flag/${flag.id}` }]
      : [{ reference: locationReference }, { reference: `${FlagResourceType}/${flag.id}` }],
    performer: isSPCHECKOrCNBEN
      ? [{ reference: `${PractitionerResourceType}/${practitionerId}` }]
      : undefined,
    note: observation.note?.[0]?.text ? [{ text: values.comments }] : observation.note,
  };
};

export const putCloseFlagResources = async (
  initialValues: CloseFlagFormFields,
  values: CloseFlagFormFields,
  activeFlag: any,
  fhirBaseUrl: string
) => {
  const { listSubject, practitionerId } = initialValues;

  const encounterPayload = generateEncounterPayload(
    encounter as IEncounter,
    activeFlag,
    practitionerId as string,
    listSubject as string
  );

  const observationPayload = generateObservationPayload(
    observation as any,
    activeFlag,
    practitionerId as string,
    listSubject as string,
    values
  );

  const updatedFlag = {
    ...activeFlag,
    status: 'inactive',
  };

  const flagPromise = postPutFlag(fhirBaseUrl, updatedFlag);

  const encounterObservationPromise = new Promise((resolve, reject) => {
    postPutEncounter(fhirBaseUrl, encounterPayload as IEncounter)
      .then((encounterRes) => {
        postPutObservation(fhirBaseUrl, observationPayload as IObservation)
          .then((observationRes) => {
            resolve({ encounterRes, observationRes });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });

  return Promise.all([flagPromise, encounterObservationPromise]);
};
