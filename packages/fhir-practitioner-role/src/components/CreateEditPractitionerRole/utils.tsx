import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import FHIR from 'fhirclient';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { URL_PRACTITIONER_ROLE } from '../../constants';
import { Dictionary } from '@onaio/utils';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { FormFields } from './Form';

export const submitForm = async (
  values: FormFields,
  fhirBaseURL: string,
  id?: string,
  uuid?: string
): Promise<void> => {
  const practitionerRoleId = uuid ? uuid : v4();
  const payload: Omit<IfhirR4.IPractitionerRole, 'meta'> = {
    resourceType: 'PractitionerRole',
    identifier: [
      {
        use: 'official',
        value: practitionerRoleId,
      },
    ],
    id: id,
    active: values.active,
    organization: values.groupsId
      ? {
          reference: `Organization/${values.groupsId}`,
        }
      : undefined,
    practitioner: values.groupsId
      ? {
          reference: `Practitioner/${values.groupsId}`,
        }
      : undefined,
  };
  const serve = FHIR.client(fhirBaseURL);
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
  history.push(URL_PRACTITIONER_ROLE);
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
