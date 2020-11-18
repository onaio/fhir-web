import { notification } from 'antd';
import Papaparse from 'papaparse';
import { OpenSRPService } from '@opensrp/server-service';
import { DownloadClientDataFormFields } from '../DownloadClientData';
import { Dispatch, SetStateAction } from 'react';
import { ERROR_OCCURRED, OPENSRP_URL_CLIENT_SEARCH, APPLICATION_CSV } from '../../constants';
import { Client } from '../../ducks/clients';
import { downloadFile } from '../../helpers/utils';

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
  setSubmitting(true);
  const { clientLocation, cardStatus, cardOrderDate } = values;
  const startDate = cardOrderDate && cardOrderDate[0];
  const endDate = cardOrderDate && cardOrderDate[1];
  let endPoint = `${OPENSRP_URL_CLIENT_SEARCH}?startDate=${startDate}&endDate=${endDate}`;

  if (clientLocation) {
    endPoint = `${endPoint}&registration_location=${clientLocation}`;
  }

  if (cardStatus) {
    endPoint = `${endPoint}&attribute=card_status:${cardStatus}`;
  }

  const serve = new serviceClass(accessToken, opensrpBaseURL, endPoint);
  serve
    .list()
    .then((clients: Client[]) => {
      const entries: ClientCSVEntry[] = clients
        .filter((client: Client) => !!client.identifiers.zeir_id)
        .map((client: Client) => {
          return {
            id: client.identifiers.zeir_id ? client.identifiers.zeir_id : '',
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
