import { UploadFileFieldTypes, UploadFilePropTypes } from '.';
import { OpenSRPService } from '@opensrp/server-service';
import { OPENSRP_FORMS_ENDPOINT, ERROR_OCCURRED } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';

/**
 * Handle form upload submission
 *
 * @param {UploadFilePropTypes} values - submitted values
 * @param {string} accessToken  - Opensrp API access token
 * @param {string} opensrpBaseURL - Opensrp API base URL
 * @param {boolean} isJsonValidator - boolean to confirm if the form is json validator or not
 * @param {Function} setSubmitting - set the form state for isSubmitting
 * @param {Function} setIfDoneHere - set the form state for ifDoneHere
 */
export const submitForm = (
  values: UploadFileFieldTypes,
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  setSubmitting: (isSubmitting: boolean) => void,
  setIfDoneHere: (ifDoneHere: boolean) => void
): void => {
  setSubmitting(true);
  const formData = new FormData();
  const { form } = values;

  Object.keys(values).forEach((key) => {
    if (key === 'form') {
      formData.append('form', form[0]);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append(key, (values as any)[key]);
    }
  });

  if (isJsonValidator) {
    formData.append('is_json_validator', 'true');
  }

  const customOptions = () => {
    return {
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
    };
  };

  const clientService = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    OPENSRP_FORMS_ENDPOINT,
    customOptions
  );
  clientService
    .create(formData)
    .then(() => {
      setIfDoneHere(true);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURRED);
    })
    .finally(() => {
      setSubmitting(false);
    });
};
