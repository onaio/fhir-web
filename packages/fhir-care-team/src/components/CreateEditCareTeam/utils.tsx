import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import {
  FHIRServiceClass,
  getObjLike,
  IdentifierUseCodes,
  parseFhirHumanName,
} from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import {
  FHIR_CARE_TEAM,
  id,
  organizationParticipants,
  organizationResourceType,
  practitionerParticipants,
  practitionerResourceType,
  URL_CARE_TEAM,
  uuid,
  name,
  status,
  managingOrganizations,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import type { TFunction } from '@opensrp/i18n';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { get, keyBy } from 'lodash';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { CareTeamParticipant } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/careTeamParticipant';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

/**
 * computes participants that should be carried over when generating the payload
 *
 * @param values - current form values
 * @param initialValues - initial form values
 */
const getCarriedOverParticipants = (values: FormFields, initialValues: FormFields) => {
  const { participant } = initialValues.initialCareTeam ?? {};
  const participantByKey = (participant ?? []).reduce((ac, val) => {
    const reference = val.member?.reference as string;
    return { ...ac, [reference]: val };
  }, {}) as Record<string, CareTeamParticipant>;
  const currentManagingOrgValuesyId = values[managingOrganizations].reduce((ac, val) => {
    return {
      ...ac,
      [val]: val,
    };
  }, {});
  const currentpractitionersById = values[practitionerParticipants].reduce((ac, val) => {
    return {
      ...ac,
      [val]: val,
    };
  }, {});
  const cleanParticipants = (refs: string[], lookup: Record<string, string>) => {
    refs.forEach((ref) => {
      if (!lookup[ref]) {
        delete participantByKey[ref];
      }
    });
  };
  cleanParticipants(initialValues.practitionerParticipants, currentpractitionersById);
  cleanParticipants(initialValues.managingOrganizations, currentManagingOrgValuesyId);
  return participantByKey;
};

export const submitForm = async (
  values: FormFields,
  initialValues: FormFields,
  fhirBaseURL: string,
  organizations: IOrganization[],
  practitioners: IPractitioner[],
  t: TFunction
): Promise<void> => {
  const { initialCareTeam, id, uuid } = initialValues;
  const { meta, text, participant, ...nonMetaFields } = initialCareTeam ?? {};

  const allPractitionersById = keyBy(
    practitioners,
    (practitioner) => `${practitionerResourceType}/${practitioner.id}`
  );
  const practitionerParticipantsById: Record<string, CareTeamParticipant> = {};
  values[practitionerParticipants].forEach((id) => {
    const fullPractitionerObj = allPractitionersById[id];
    practitionerParticipantsById[id] = {
      member: {
        reference: id,
        display: getPatientName(fullPractitionerObj),
      },
    };
  });

  const organizationsById = keyBy(organizations, (org) => `${organizationResourceType}/${org.id}`);
  const managingOrgsById: Record<string, CareTeamParticipant> = {};
  values[managingOrganizations].forEach((id) => {
    const orgName = (organizationsById[id] as IOrganization | undefined)?.name;
    const orgDisplay = orgName ? { display: organizationsById[id].name } : {};
    managingOrgsById[id] = {
      role: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '394730007',
              display: 'Healthcare related organization',
            },
          ],
        },
      ],
      member: {
        ...orgDisplay,
        reference: id,
      },
    };
  });

  const carriedOverParticipantsById = getCarriedOverParticipants(values, initialValues);
  const finalParticipantsById = {
    ...carriedOverParticipantsById,
    ...practitionerParticipantsById,
    ...managingOrgsById,
  };

  const managingOrgsPayload = Object.values(managingOrgsById).map(
    (obj) => obj.member
  ) as Reference[];

  const careTeamId = uuid ? uuid : v4();
  const payload: Omit<IfhirR4.ICareTeam, 'meta'> = {
    ...nonMetaFields,
    resourceType: FHIR_CARE_TEAM,
    identifier: [
      {
        use: 'official',
        value: careTeamId, // uuid
      },
    ],
    id: id ? id : careTeamId,
    name: values.name,
    status: values.status as IfhirR4.CareTeam.StatusEnum,
    participant: Object.values(finalParticipantsById),
    managingOrganization: managingOrgsPayload,
  };

  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  let successNotificationMessage = t('Successfully added CareTeams');
  if (id) {
    successNotificationMessage = t('Successfully updated CareTeams');
  }
  await serve
    .update(payload)
    // TODO - possible place to use translation plurals
    .then(() => sendSuccessNotification(successNotificationMessage))
    .catch(() => {
      sendErrorNotification(t('There was a problem fetching the Care Team'));
    })
    .finally(() => history.push(URL_CARE_TEAM));
};

/**
 * Util function to build out patient or practitioner name
 *
 * @param {object} obj - patient resource object
 * @returns {string | undefined} - returns patient or practitioner name string
 */
export function getPatientName<T extends { name?: HumanName[] }>(obj?: T | undefined) {
  if (!obj) {
    return '';
  }

  const names = obj.name;
  const officialName = getObjLike(names, 'use', IdentifierUseCodes.OFFICIAL)[0];
  return parseFhirHumanName(officialName);
}

export interface FormFields {
  [uuid]?: string;
  [id]?: string;
  [name]?: string;
  [status]?: string;
  [practitionerParticipants]: string[];
  initialCareTeam?: ICareTeam;
  [organizationParticipants]: string[];
  [managingOrganizations]: string[];
}

export const defaultInitialValues: FormFields = {
  [uuid]: '',
  [id]: '',
  [name]: '',
  [status]: 'active',
  initialCareTeam: undefined,
  [managingOrganizations]: [],
  [organizationParticipants]: [],
  [practitionerParticipants]: [],
};

export const getCareTeamFormFields = (careTeam?: ICareTeam): FormFields => {
  if (!careTeam) {
    return defaultInitialValues;
  }
  const { id, identifier, name, status, participant } = careTeam;
  const officialIdentifier = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL);
  const participantRefs = (participant ?? [])
    .map((participant) => participant.member?.reference)
    .filter((x) => x !== undefined) as string[];
  const practitionerRefs = participantRefs.filter((ref) => {
    return ref.startsWith(practitionerResourceType);
  });
  const organizationRefs = participantRefs.filter((ref) => {
    return ref.startsWith(organizationResourceType);
  });
  const managingOrgsRefs = (careTeam.managingOrganization ?? [])
    .map((ref) => ref.reference)
    .filter((ref) => !!ref) as string[];

  return {
    uuid: get(officialIdentifier, '0.value', undefined),
    id,
    name,
    status,
    initialCareTeam: careTeam,
    practitionerParticipants: practitionerRefs,
    organizationParticipants: organizationRefs,
    managingOrganizations: managingOrgsRefs,
  };
};

export interface SelectOptions {
  value: string;
  label?: string;
}

export const getOrgSelectOptions = (orgs: IOrganization[] = []): SelectOptions[] => {
  return orgs.map((org) => {
    return {
      value: `${organizationResourceType}/${org.id}`,
      label: org.name,
    };
  });
};

export const getPractitionerSelectOptions = (resources: IPractitioner[] = []): SelectOptions[] => {
  return resources.map((res) => {
    return {
      value: `${practitionerResourceType}/${res.id}`,
      label: getPatientName(res),
    };
  });
};

/**
 * filter practitioners select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const selectFilterFunction = (inputValue: string, option?: SelectOptions) => {
  return !!option?.label?.toLowerCase().includes(inputValue.toLowerCase());
};
