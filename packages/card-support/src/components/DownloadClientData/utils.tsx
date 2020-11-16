import { notification } from 'antd';
import Papaparse from 'papaparse';
import { OpenSRPService } from '@opensrp/server-service';
import { DownloadClientDataFormFields } from '../DownloadClientData';
import { Dispatch, SetStateAction } from 'react';
import { locationHierachyDucks, TreeNode } from '@opensrp/location-management';
import {
  ERROR_OCCURRED,
  OPENSRP_URL_CLIENT_SEARCH,
  OPENSRP_URL_USER_ASSIGNMENT,
  TEXT_CSV,
} from '../../constants';
import { Client } from '../../ducks/clients';

/** interface for user assignment response */
export interface UserAssignment {
  organizationIds: number[];
  jurisdictions: string[];
  plans: string[];
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
  setSubmitting: (isSubmitting: boolean) => void,
  locations: TreeNode[]
): void => {
  setSubmitting(true);
  const { clientLocation, cardStatus, cardOrderDate } = values;
  const startDate = cardOrderDate && cardOrderDate[0];
  const endDate = cardOrderDate && cardOrderDate[1];

  // If client location is falsy, then we use the default client location, else
  // we use the selected location
  if (!clientLocation) {
    const serve = new serviceClass(accessToken, opensrpBaseURL, OPENSRP_URL_USER_ASSIGNMENT);
    serve
      .list()
      .then((assignment: UserAssignment) => {
        const { jurisdictions } = assignment;
        const defaultLocationId = jurisdictions[0];
        getClientData(
          defaultLocationId,
          accessToken,
          opensrpBaseURL,
          serviceClass,
          startDate,
          endDate,
          setSubmitting,
          locations,
          cardStatus
        );
      })
      .catch((_: Error) => {
        setSubmitting(false);
        notification.error({
          message: ERROR_OCCURRED,
          description: '',
        });
      });
  } else {
    getClientData(
      clientLocation,
      accessToken,
      opensrpBaseURL,
      serviceClass,
      startDate,
      endDate,
      setSubmitting,
      locations,
      cardStatus
    );
  }
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
  return `${location}_${formatDDMMYYY(new Date(), '_')}_(${startDate}-${endDate})`;
};

/**
 * Fetch client data
 *
 * @param {string} locationId - the location id of the facility
 * @param {string} accessToken - OPENSRP API access token
 * @param {string} opensrpBaseURL - OPENSRP API base URL
 * @param {string} serviceClass - OPENSRP service class
 * @param {string} startDate - start date of the date range filter
 * @param {string} endDate - end date of the date filter
 * @param {Function} setSubmitting - method to set form `isSubmitting` status
 * @param {string} cardStatus - card status filter value
 */
export const getClientData = (
  locationId: string,
  accessToken: string,
  opensrpBaseURL: string,
  serviceClass: typeof OpenSRPService,
  startDate: string,
  endDate: string,
  setSubmitting: (isSubmitting: boolean) => void,
  locations: TreeNode[],
  cardStatus?: string
): void => {
  let endpoint = `${OPENSRP_URL_CLIENT_SEARCH}?&registration_location=${locationId}&startDate=${startDate}&endDate=${endDate}`;

  if (cardStatus) {
    endpoint += `&attribute=card_status:${cardStatus}`;
  }

  const serve = new serviceClass(accessToken, opensrpBaseURL, endpoint);

  serve
    .list()
    .then((clients: Client[]) => {
      const locationDetails = getLocationDetails(locations, locationId);
      const facilityOfRegistration = locationDetails ? locationDetails.title : '';
      const entries: ClientCSVEntry[] = clients.map((client: Client) => {
        return {
          idNumber: client._id,
          dob: formatDDMMYYY(new Date(client.birthdate)),
          firstName: client.firstName,
          lastName: client.lastName,
          gender: client.gender,
          facilityOfRegistration: facilityOfRegistration,
        };
      });

      createCsv(entries, buildCSVFileName(facilityOfRegistration, startDate, endDate));
      setSubmitting(false);
    })
    .catch((_: Error) => {
      setSubmitting(false);
      notification.error({
        message: ERROR_OCCURRED,
        description: '',
      });
    });
};

/** Function to download data to a file
 *
 * @param {string} data - data to be written to file
 * @param {string} filename - name of the file to be saved
 * @param {string} type - MIME type for the file
 */
export const downloadFile = (data: string, filename: string, type: string) => {
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    const docElement = document.createElement('a');
    const url = URL.createObjectURL(file);
    docElement.href = url;
    docElement.download = filename;
    document.body.appendChild(docElement);
    docElement.click();
    setTimeout(() => {
      document.body.removeChild(docElement);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};

/** interface for CSV entries */
export interface ClientCSVEntry {
  idNumber: string;
  dob: string;
  firstName: string;
  lastName: string;
  gender: string;
}

// Create csv data for the selected jurisdiction hieracrhy
const createCsv = (entries: ClientCSVEntry[], fileName: string): void => {
  const csv: string = Papaparse.unparse(entries, {
    header: true,
  });
  // Export csv file
  downloadFile(csv, fileName, TEXT_CSV);
};

const getLocationDetails = (locations: TreeNode[], locationId: string): TreeNode | null => {
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
