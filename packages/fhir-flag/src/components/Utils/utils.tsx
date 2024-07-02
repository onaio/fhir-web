import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { v5 } from 'uuid';
import { encounter, observation } from '../../payloadConfigs';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { EncounterResourceType, FlagResourceType, ObservationResourceType } from '../../constants';

export interface CloseFlagFormFields {
  productName: string;
  locationName?: string;
  status?: string;
  comments?: string;
  listSubject?: string;
  practitionerId?: string;
}

export const buildInitialFormFieldValues = (
  productName?: any,
  locationName?: string,
  listSubject?: string,
  practitionerId?: string
): CloseFlagFormFields => {
  return {
    productName,
    locationName,
    listSubject,
    practitionerId,
  };
};

// Utility function to generate common properties
const generateCommonProperties = (id: string, flag: IFlag) => ({
  id: v5(id, flag.id as string),
  meta: {
    ...flag.meta,
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
  return serve.create(payload);
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the observation payload
 */
export const postPutObservation = (baseUrl: string, payload: IObservation) => {
  const serve = new FHIRServiceClass<IObservation>(baseUrl, ObservationResourceType);
  return serve.create(payload);
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
  listSubjectReference: string
) => {
  const commonProperties = generateCommonProperties('Encounter', flag);
  const reference =
    flag.category?.[0]?.coding?.[0].code === 'SPCHECK' ||
    flag.category?.[0]?.coding?.[0].code === 'CNBEN'
      ? flag.subject.reference
      : listSubjectReference;

  return {
    ...encounter,
    ...commonProperties,
    partOf: { reference: flag?.encounter?.reference },
    location: [{ location: { reference }, status: 'active' }],
  };
};

export const generateObservationPayload = (
  observation: IObservation,
  flag: IFlag,
  practitionerId: string,
  listSubjectReference: string,
  values: CloseFlagFormFields
) => {
  const commonProperties = generateCommonProperties('Observation', flag);
  const isSPCHECKOrCNBEN =
    flag.category?.[0]?.coding?.[0].code === 'SPCHECK' ||
    flag.category?.[0]?.coding?.[0].code === 'CNBEN';

  return {
    ...observation,
    ...commonProperties,
    subject: { reference: flag.subject?.reference },
    encounter: { reference: `Encounter/${commonProperties.id}` },
    focus: isSPCHECKOrCNBEN
      ? [{ reference: `Flag/${flag.id}` }]
      : [{ reference: listSubjectReference }, { reference: `Flag/${flag.id}` }],
    performer: isSPCHECKOrCNBEN ? [{ reference: `Practitioner/${practitionerId}` }] : undefined,
    note: observation.note?.[0]?.text ? [{ text: values.comments }] : observation.note,
  };
};

export const postCloseFlagResources = async (
  initialValues: CloseFlagFormFields,
  values: CloseFlagFormFields,
  activeFlag: any,
  fhirBaseUrl: string
) => {
  /**
   * Check active flag type
   * if category is spcheck on cnben call locationbasedflag builder
   * get updated encounter/observation payload and updated flag
   * do a post on encounter, observation and flag resources respectively
   * Apply the same for product based flags */

  const { listSubject, practitionerId } = initialValues;

  const encounterPayload = generateEncounterPayload(
    encounter as IEncounter,
    activeFlag,
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

  const encounterPost = await postPutEncounter(fhirBaseUrl, encounterPayload as IEncounter);
  const observationPost = await postPutObservation(fhirBaseUrl, observationPayload as IObservation);
  const flagUpdate = await postPutFlag(fhirBaseUrl, updatedFlag);
  return {
    encounterResponse: encounterPost,
    observationResponse: observationPost,
    flagUpdateResponse: flagUpdate,
  };
};
