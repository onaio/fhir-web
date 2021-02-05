import { OpenSRPService } from '@opensrp/react-utils';
import { getFetchOptions } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_ENDPOINT_SETTINGS } from '../../constants';
import { ERROR_GENERIC } from '../../lang';
import { Setting } from '../../components/InventoryItemForm';

/**
 * Fetch settings
 *
 * @param openSRPBaseURL OpenSRP API base URL
 * @param openSRPService OpenRSP service class
 * @param params settings endpoint params
 * @param setSettings set settings fetch in component state
 * @param customOptions OpenSRP class custom fetch options
 */
export const fetchSettings = (
  openSRPBaseURL: string,
  openSRPService: typeof OpenSRPService,
  params: Dictionary,
  setSettings: Dispatch<SetStateAction<Setting[]>>,
  customOptions?: typeof getFetchOptions
) => {
  const service = new openSRPService(OPENSRP_ENDPOINT_SETTINGS, openSRPBaseURL, customOptions);
  service
    .list(params)
    .then((response: Setting[]) => setSettings(response))
    .catch(() => sendErrorNotification(ERROR_GENERIC));
};
