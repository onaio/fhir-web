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

export const submitForm = async (
  values: FormFields,
  fhirBaseURL: string,
  organizations: IOrganization[],
  practitioners: IPractitioner[],
  t: TFunction,
  id?: string,
  uuid?: string
): Promise<void> => {
  const { initialCareTeam } = values;
  const { meta, text, participant, ...nonMetaFields } = initialCareTeam ?? {};
  const carriedOverParticipants = (participant ?? []).filter(
    (participant) =>
      !participant.member?.reference?.startsWith(organizationResourceType) ||
      !participant.member.reference.startsWith(practitionerResourceType)
  );
  const careTeamId = uuid ? uuid : v4();

  const practitionerParticipantPayload = values[practitionerParticipants].map((id) => {
    return {
      member: {
        reference: id,
        display: getPatientName(
          practitioners.find(
            (practitioner) => `${practitionerResourceType}/${practitioner.id}` === id
          )
        ),
      },
    };
  });

  const organizationsById = keyBy(organizations, (org) => `${organizationResourceType}/${org.id}`);

  const managingOrgsPayload = values[managingOrganizations].map((id) => {
    return {
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
        reference: id,
        display: organizationsById[id].name,
      },
    };
  });

  const payload: Omit<IfhirR4.ICareTeam, 'meta'> = {
    ...nonMetaFields,
    resourceType: FHIR_CARE_TEAM,
    identifier: [
      {
        use: 'official',
        value: careTeamId, // uuid
      },
    ],
    id: id, // human readable id
    name: values.name,
    status: values.status as IfhirR4.CareTeam.StatusEnum,
    participant: [
      ...carriedOverParticipants,
      ...managingOrgsPayload,
      ...practitionerParticipantPayload,
    ],
  };

  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  let successNotifictaionMessage: string;
  if (id) {
    successNotifictaionMessage = t('Successfully Updated Care Teams');
  } else {
    successNotifictaionMessage = t('Successfully Added Care Teams');
  }
  await serve
    .update(payload)
    // TODO - possible place to use translation plurals
    .then(() => sendSuccessNotification(successNotifictaionMessage))
    .catch(() => {
      sendErrorNotification(t('An error occurred'));
    });
  history.push(URL_CARE_TEAM);
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
  [status]: '',
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
  return {
    uuid: get(officialIdentifier, '0.value', undefined),
    id,
    name,
    status,
    initialCareTeam: careTeam,
    practitionerParticipants: practitionerRefs,
    organizationParticipants: organizationRefs,
    managingOrganizations: (careTeam.managingOrganization ?? [])
      .map((ref) => ref.reference)
      .filter((item) => item !== undefined) as string[],
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
