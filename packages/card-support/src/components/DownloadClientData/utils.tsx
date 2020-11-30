import { notification } from 'antd';
import Papaparse from 'papaparse';
import { OpenSRPService } from '@opensrp/server-service';
import { DownloadClientDataFormFields } from '../DownloadClientData';
import { Dispatch, SetStateAction } from 'react';
import { ERROR_OCCURRED, OPENSRP_URL_CLIENT_SEARCH, APPLICATION_CSV } from '../../constants';
import { Client } from '../../ducks/clients';
import { downloadFile } from '../../helpers/utils';
import { TreeNode } from '@opensrp/location-management/dist/types';
import { Dictionary } from '@onaio/utils';

/** interface for user assignment response */
export interface UserAssignment {
  organizationIds: number[];
  jurisdictions: string[];
  plans: string[];
}

/** interface for CSV entries */
export interface ClientCSVEntry {
  id: string;
  dob: string;
  firstName: string;
  lastName: string;
  gender: string;
}

/**
 * Handle form date change
 *
 * @param {string} range - selected date range
 * @param {Dispatch<SetStateAction<[string, string]>>} setCardOrderDate - state dispatcher
 */
export const handleCardOrderDateChange = (
  range: [string, string],
  setCardOrderDate: Dispatch<SetStateAction<[string, string]>>
): void => {
  setCardOrderDate(range);
};

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
  const { clientLocation, cardStatus, cardOrderDate } = values;

  if (!clientLocation) {
    return;
  }

  setSubmitting(true);
  const startDate = cardOrderDate[0];
  const endDate = cardOrderDate[1];
  const endPoint = `${OPENSRP_URL_CLIENT_SEARCH}`;
  const serve = new serviceClass(accessToken, opensrpBaseURL, endPoint);
  let params: Dictionary = {
    locationIds: clientLocation,
  };

  if (cardStatus) {
    params = {
      ...params,
      attribute: `card_status:${cardStatus}`,
    };
  }

  serve
    .list(params)
    .then((clients: Client[]) => {
      const entries: ClientCSVEntry[] = clients
        .filter((client: Client) => !!client.identifiers.zeir_id)
        .filter((client: Client) => {
          const dateCreated = new Date(client.dateCreated.split('T')[0]);

          return (
            dateCreated.getTime() >= new Date(startDate).getTime() &&
            dateCreated.getTime() <= new Date(endDate).getTime()
          );
        })
        .map((client: Client) => {
          return {
            id: client.identifiers.zeir_id,
            dob: formatDDMMYYY(new Date(client.birthdate)),
            firstName: client.firstName,
            lastName: client.lastName,
            gender: client.gender,
          };
        });

      setSubmitting(false);

      if (entries.length) {
        createCsv(entries, buildCSVFileName('', startDate, endDate));
      } else {
        notification.error({
          message: 'No data found',
          description: '',
        });
      }
    })
    .catch((_: Error) => {
      setSubmitting(false);
      notification.error({
        message: ERROR_OCCURRED,
        description: '',
      });
    });
};

/**
 * Format a Date object as dd MM YYYY
 *
 * @param {Date} date - date object
 * @param {string} delimiter - delimiter to use to separate the different parts
 * @returns {string} formatted date
 */
export const formatDDMMYYY = (date: Date, delimiter = '/'): string => {
  //eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return `${('0' + date.getDate()).slice(-2)}${delimiter}${('0' + (date.getMonth() + 1)).slice(
    -2
  )}${delimiter}${date.getFullYear()}`;
};

/**
 * Build the CSV file name
 *
 * @param {string} location - name of the location filter
 * @param {string} startDate - start date of the range filter
 * @param {string} endDate - end date of the range filter
 * @returns {string} CSV file name
 */
export const buildCSVFileName = (location: string, startDate: string, endDate: string): string => {
  return `Children_list_${location}_${formatDDMMYYY(new Date(), '_')}_(${formatDDMMYYY(
    new Date(startDate),
    '-'
  )} - ${formatDDMMYYY(new Date(endDate), '-')})`;
};

// Create csv data for the selected jurisdiction hieracrhy
export const createCsv = (entries: ClientCSVEntry[], fileName: string): void => {
  const csv: string = Papaparse.unparse(entries, {
    header: true,
  });
  // Export csv file
  downloadFile(csv, fileName, APPLICATION_CSV);
};

export const getLocationDetails = (locations: TreeNode[], locationId: string): TreeNode | null => {
  let found = false;
  let i = 0;
  let location = null;

  while (!found && i < locations.length) {
    const node = locations[i];

    if (node.id) {
      if (node.id === locationId) {
        found = true;
        location = node;
      }
    } else {
      location = getLocationDetails(node.children, locationId);

      if (location) {
        found = true;
      }
    }

    i += 1;
  }

  return location;
};
