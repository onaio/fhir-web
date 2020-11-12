import { OpenSRPService } from '@opensrp/server-service';
import { DownloadClientDataFormFields } from '../DownloadClientData';
import { OPENSRP_URL_USER_ASSIGNMENT } from '../../constants';

/** interface for user assignment response */
export interface UserAssignment {
  organizationIds: number[];
  jurisdictions: string[];
  plans: string[];
}

/**
 * Handle download client data form submission
 *
 * @param {DownloadClientDataFormFields} values - sumitted form values
 * @param {string} accessToken - OPENSRP API access token
 * @param {string} opensrpBaseURL - OPENSRP API base URL
 * @param {string} serviceClass - OPENSRP service class
 * @param {Function} setSubmitting - method to set form `isSubmitting` status
 */
export const submitForm = (
  values: DownloadClientDataFormFields,
  accessToken: string,
  opensrpBaseURL: string,
  serviceClass: typeof OpenSRPService,
  setSubmitting: (isSubmitting: boolean) => void
): void => {
  //const { clientLocation, cardStatus, cardOrderDate } = values;
  const { clientLocation } = values;

  // If client location is falsy, then we use the default client location
  if (!clientLocation) {
    const serve = new serviceClass(accessToken, opensrpBaseURL, OPENSRP_URL_USER_ASSIGNMENT);
    serve
      .list()
      .then((_: UserAssignment) => {
        setSubmitting(false);
      })
      .catch((_: Error) => {
        setSubmitting(false);
      });
  }
};
