import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { FHIR_CARE_TEAM, URL_CARE_TEAM } from '../../constants';
import { Dictionary } from '@onaio/utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Fields, FormFields } from './Form';

export const submitForm = async (
  values: FormFields,
  fhirBaseURL: string,
  groups: Fields[],
  practitioners: Fields[],
  id?: string,
  uuid?: string
): Promise<void> => {
  const singleGroup = groups.find((group) => group.id === values.groupsId);
  const careTeamId = uuid ? uuid : v4();
  const payload: Omit<IfhirR4.ICareTeam, 'meta'> = {
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
    subject: values.groupsId
      ? {
          reference: `Group/${values.groupsId}`,
          display: singleGroup?.name,
        }
      : undefined,
    participant:
      values.practitionersId?.map((id) => {
        return {
          member: {
            reference: `Practitioner/${id}`,
            display: practitioners.find((practitioner) => practitioner.id === id)?.name,
          },
        };
      }) ?? [],
  };
  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  if (id) {
    await serve
      .update(payload)
      .then(() => sendSuccessNotification(lang.CARE_TEAMS_UPDATE_SUCCESS))
      .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
  } else {
    await serve
      .create(payload)
      .then(() => sendSuccessNotification(lang.CARE_TEAMS_ADD_SUCCESS))
      .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
  }
  history.push(URL_CARE_TEAM);
};

/** Util function to build out patient or practitioner name
 *
 * @param {object} patient - patient resource object
 * @returns {string} - returns patient or practitioner name string
 */
export function getPatientName(patient: Dictionary | undefined) {
  if (!patient) {
    return '';
  }

  let name = patient.name;
  if (!Array.isArray(name)) {
    name = [name];
  }
  name = name[0];
  if (!name) {
    return '';
  }

  const family = Array.isArray(name.family) ? name.family : [name.family];
  const given = Array.isArray(name.given) ? name.given : [name.given];
  const prefix = Array.isArray(name.prefix) ? name.prefix : [name.prefix];
  const suffix = Array.isArray(name.suffix) ? name.suffix : [name.suffix];

  return [
    prefix.map((t = '') => String(t).trim()).join(' '),
    given.map((t = '') => String(t).trim()).join(' '),
    family.map((t = '') => String(t).trim()).join(' '),
    suffix.map((t = '') => String(t).trim()).join(' '),
  ]
    .filter(Boolean)
    .join(' ');
}
