import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService, handleSessionOrTokenExpiry } from '@opensrp/react-utils';
import { HTTPError } from '@opensrp/server-service';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_ENDPOINT_STOCK_RESOURCE } from '../../constants';

import { ERROR_GENERIC } from '../../lang';

export interface InventoryItemPayloadPOST {
  productName: string;
  quantity: number;
  deliveryDate: string;
  accountabilityEndDate: string;
  unicefSection: string;
  donor: string;
  poNumber: number;
  servicePointId: string;
  serialNumber?: string;
}

export const submitForm = async (
  values: InventoryItemPayloadPOST,
  openSRPBaseURL: string,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
  setIfDoneHere: Dispatch<SetStateAction<boolean>>,
  inventoryID?: string
) => {
  setSubmitting(true);
  const token = await handleSessionOrTokenExpiry();
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
        sendErrorNotification(ERROR_GENERIC);
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
        sendErrorNotification(ERROR_GENERIC);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }
};
