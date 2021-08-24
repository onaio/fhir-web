import moment from 'moment';
import { sendErrorNotification } from '@opensrp-web/notifications';
import { OpenSRPService, handleSessionOrTokenExpiry } from '@opensrp-web/react-utils';
import { HTTPError } from '@opensrp-web/server-service';
import { InventoryPost } from '../../ducks/inventory';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_ENDPOINT_STOCK_RESOURCE } from '../../constants';
import lang, { Lang } from '../../lang';

/**
 * Submit form
 *
 * @param values values to be submitted
 * @param openSRPBaseURL OpenSRP API base URL
 * @param setSubmitting set isSubmitting value in the form's state
 * @param setIfDoneHere set ifDoneHere value in the form's state
 * @param inventoryID ID of inventory item during editing
 * @param langObj - the language translation lookup
 */
export const submitForm = async (
  values: InventoryPost,
  openSRPBaseURL: string,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
  setIfDoneHere: Dispatch<SetStateAction<boolean>>,
  inventoryID?: string,
  langObj: Lang = lang
) => {
  setSubmitting(true);
  const token = await handleSessionOrTokenExpiry();

  /**
   * Fetch options are overriden here because the API currently only processes the payload
   * when the headers `accept`, and `content-type` have the values of / and application/json
   * respectively. If this issue is resolved on the API, then this override can be removed
   */
  const customOptions = () => {
    return {
      body: inventoryID
        ? JSON.stringify({
            ...values,
            stockId: inventoryID,
          })
        : JSON.stringify(values),
      headers: {
        authorization: `Bearer ${token}`,
        accept: '*/*',
        'content-type': 'application/json',
      },
      method: inventoryID ? 'PUT' : 'POST',
    };
  };

  if (!inventoryID) {
    const service = new OpenSRPService(
      OPENSRP_ENDPOINT_STOCK_RESOURCE,
      openSRPBaseURL,
      customOptions
    );
    service
      .create(values)
      .then(() => {
        setIfDoneHere(true);
      })
      .catch((_: HTTPError) => {
        sendErrorNotification(langObj.ERROR_GENERIC);
      })
      .finally(() => {
        setSubmitting(false);
      });
  } else {
    const service = new OpenSRPService(
      `${OPENSRP_ENDPOINT_STOCK_RESOURCE}${inventoryID}`,
      openSRPBaseURL,
      customOptions
    );
    service
      .update({
        ...values,
        stockId: inventoryID,
      })
      .then(() => {
        setIfDoneHere(true);
      })
      .catch((_: HTTPError) => {
        sendErrorNotification(langObj.ERROR_GENERIC);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }
};

/**
 * Return true if date is today or in the past, false otherwise
 *
 * @param current date
 */
export const isDatePastOrToday = (current: moment.Moment) => {
  return current < moment().endOf('day');
};

/**
 * Rteurn true if date is in the future, false othewise
 *
 * @param current date
 */
export const isDateFuture = (current: moment.Moment) => {
  return current > moment().endOf('day');
};
