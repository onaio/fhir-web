import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { getFetchOptions, HTTPError } from '@opensrp/server-service';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_ENDPOINT_STOCK_RESOURCE } from '../../constants';

import { ERROR_GENERIC } from '../../lang';

export interface InventoryItemPayloadPost {
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

export const submitForm = (
  values: InventoryItemPayloadPost,
  openSRPBaseURL: string,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
  setIfDoneHere: Dispatch<SetStateAction<boolean>>,
  customOptions?: typeof getFetchOptions
) => {
  setSubmitting(true);

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
};
