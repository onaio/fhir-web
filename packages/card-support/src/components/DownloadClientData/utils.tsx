import Papaparse from 'papaparse';
import { OpenSRPService } from '@opensrp/server-service';
import { DownloadClientDataFormFields } from '../DownloadClientData';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_URL_CLIENT_SEARCH, APPLICATION_CSV } from '../../constants';
import { Client } from '../../ducks/clients';
import { downloadFile } from '../../helpers/utils';
import { ParsedHierarchyNode } from '@opensrp/location-management';
import { sendErrorNotification } from '@opensrp/notifications';
import { Dictionary } from '@onaio/utils';
import lang, { Lang } from '../../lang';
/* eslint-disable @typescript-eslint/camelcase */

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
  first_name: string;
  last_name: string;
  gender: string;
  facility_of_registration: string;
  date_of_registration: string;
  card_status: string;
  card_status_last_update: string;
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
 * @param values - sumitted form values
 * @param accessToken - OPENSRP API access token
 * @param opensrpBaseURL - OPENSRP API base URL
 * @param serviceClass - OPENSRP service class
 * @param locations location hierarchy
 * @param setSubmitting - method to set form `isSubmitting` status
 * @param langObj - tthe lang object
 */
export const submitForm = (
  values: DownloadClientDataFormFields,
  accessToken: string,
  opensrpBaseURL: string,
  serviceClass: typeof OpenSRPService,
  locations: ParsedHierarchyNode[],
  setSubmitting: (isSubmitting: boolean) => void,
  langObj: Lang = lang
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
      const location = getLocationDetails(locations, clientLocation);
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
            dob: formatDDMMYYY(new Date(client.birthdate.split('T')[0])),
            first_name: client.firstName,
            last_name: client.lastName,
            gender: client.gender,
            facility_of_registration: location ? location.title : '',
            date_of_registration: formatDDMMYYY(new Date(client.dateCreated.split('T')[0])),
            card_status: client.attributes.card_status,
            card_status_last_update: formatDDMMYYY(
              new Date(client.attributes.card_status_date.split('T')[0])
            ),
          };
        });

      setSubmitting(false);

      if (entries.length) {
        createCsv(entries, buildCSVFileName(location ? location.title : '', startDate, endDate));
      } else {
        sendErrorNotification(langObj.NO_DATA_FOUND);
      }
    })
    .catch((_: Error) => {
      setSubmitting(false);
      sendErrorNotification(langObj.ERROR_OCCURRED);
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
  downloadFile(csv, `${fileName}.csv`, APPLICATION_CSV);
};

/**
 * Get location from the location hierarchy
 *
 * @param {ParsedHierarchyNode} locations location hierarchy
 * @param {string} locationId id of location to return
 * @returns {ParsedHierarchyNode | null} location if found, null if not found
 */
export const getLocationDetails = (
  locations: ParsedHierarchyNode[],
  locationId: string
): ParsedHierarchyNode | null => {
  let found = false;
  let i = 0;
  let location = null;

  while (!found && i < locations.length) {
    const node = locations[i];

    if (node.id && node.id === locationId) {
      found = true;
      location = node;
    } else if (node.children) {
      location = getLocationDetails(node.children, locationId);

      if (location) {
        found = true;
      }
    }

    i += 1;
  }

  return location;
};
