import { Dispatch, SetStateAction } from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakService } from '@opensrp/keycloak-service';
import { v4 } from 'uuid';
import FHIR from 'fhirclient';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { URL_CARE_TEAM } from '../../constants';
import { Dictionary } from '@onaio/utils';
import { fhirR4 } from '@smile-cdr/fhirts';
import { FormFields } from './Form';

export const submitForm = async (
  values: FormFields,
  fhirBaseURL: string,
  id?: string
): Promise<void> => {
  const careTeamId = id ?? v4();
  const payload: fhirR4.CareTeam = {
    resourceType: 'CareTeam',
    identifier: [
      {
        use: 'official',
        value: careTeamId,
      },
    ],
    name: values.name,
    status: values.status,
    subject: {
      reference: `Group/${values.groupsId}`,
    },
    participant: values.practitionersId?.map((id) => {
      return {
        member: {
          reference: `Practitioner/${id}`,
        },
      };
    }),
  };
  const serve = FHIR.client(fhirBaseURL);
  if (id) {
    await serve
      .update(payload as Dictionary)
      .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
  } else {
    await serve
      .create(payload as Dictionary)
      .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
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
