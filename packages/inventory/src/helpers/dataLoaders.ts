/** data loading functions */
import { handleSessionOrTokenExpiry, OpenSRPService } from '@opensrp/react-utils';
import { URLParams } from '@opensrp/server-service/dist/types';
import axios, { AxiosResponse, CancelToken } from 'axios';
import { split, trim } from 'lodash';
import {
  LOCATIONS_COUNT_ALL_ENDPOINT,
  OPENSRP_API_BASE_URL,
  OPENSRP_UPLOAD_STOCK_ENDPOINT,
} from '../constants';

/** bad response error */
export interface BadRequestError {
  rowsNumber: string;
  rowsProcessed: string;
  errors: {
    row: string;
    failureReason?: string;
  }[];
}

/** describes response when csv is successfully uploaded, or validated */
export interface SuccessfulResponse {
  rowCount: number;
}

/**
 * parses a single error row and returns an easily code-readable object
 *
 * @param errorRow - a row as string
 */
export const parseSingleErrorRow = (errorRow: string) => {
  const splitText = split(errorRow, ',').map((text) => trim(text, '[]" '));
  const row = splitText[0];
  const failureReason = splitText.splice(1).join(', ');
  return { row, failureReason };
};

/**
 * parse error response which is text
 *
 * @param resText - string response showing what lines in the uploaded csv were defective
 */
export const parseTextResponse = (resText: string) => {
  // divide response into lines
  const splitText = split(resText, '\n').map((text) => trim(text, '\r'));
  // find rowsProcessed
  const rowsTotalNumberPrefix = 'Total Number of Rows in the CSV ';
  // find processed rows
  const processedRowsPrefix = 'Rows processed ';
  // find beginning of row number errors
  const errorsHeader = 'Row Number,Reason of Failure';
  let rowsNumber = '0';
  let rowsProcessed = '0';
  let errorsStartIndex: number;
  const errors: BadRequestError['errors'] = [];
  splitText.forEach((entry, index) => {
    if (entry.includes(rowsTotalNumberPrefix)) {
      rowsNumber = split(entry, ',')[1] ?? rowsNumber;
    }
    if (entry.includes(processedRowsPrefix)) {
      rowsProcessed = split(entry, ',')[1] ?? rowsProcessed;
    }
    if (entry.includes(errorsHeader)) {
      errorsStartIndex = index;
    }
    if (errorsStartIndex && index > errorsStartIndex) {
      errors.push(parseSingleErrorRow(entry));
    }
  });
  return {
    rowsNumber,
    rowsProcessed,
    errors,
  };
};

// Add a request interceptor to refresh the token
axios.interceptors.request.use(
  async (config) => {
    const accessToken = await handleSessionOrTokenExpiry();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

/**
 * @param file - the file to upload
 * @param baseURL -  the openSRP - base url
 * @param endpoint - endpoint to hit
 * @param onFinishUpload - called after the file is fully sent to the api
 * @param onBadRequest - called due to a 400 bad request error
 * @param onRequestStart - called before request is invoked
 * @param onRequestCancel - called when user cancels request
 * @param cancelToken - used to cancel token
 */
export async function uploadCSV(
  file: File,
  baseURL: string = OPENSRP_API_BASE_URL,
  endpoint: string = OPENSRP_UPLOAD_STOCK_ENDPOINT,
  onFinishUpload?: () => void,
  onBadRequest?: (errData: BadRequestError) => void,
  onRequestStart?: () => void,
  onRequestCancel?: () => void,
  cancelToken?: CancelToken
) {
  const data = new FormData();
  // name of key of file in payload
  const payLoadKeyName = 'file';

  data.append(payLoadKeyName, file, file.name);

  // set loading has begun, file upload
  onRequestStart?.();

  // configure request
  return axios
    .post(endpoint, data, {
      baseURL,
      validateStatus: (status) => status === 200 || status === 201,
      onUploadProgress: (event: ProgressEvent) => {
        // known when upload has ended, we can deduce that validation has started
        if (event.loaded === event.total) {
          onFinishUpload?.();
        }
      },
      cancelToken,
    })
    .then((response: AxiosResponse<SuccessfulResponse | string>) => {
      return response.data;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        // called when user cancels the request
        onRequestCancel?.();
      }
      if (err.response.status === 400) {
        const parsedError = parseTextResponse(err.response.data);
        onBadRequest?.(parsedError);
        return;
      }
      return Promise.reject(err);
    });
}

/** response on doing a get count request */
export interface CountResponse {
  count: number;
}

const defaultCountParams = {
  serverVersion: 0,
};

/**
 * loader function to get count of locations
 *
 * @param dispatcher - called with response, adds data to store
 * @param openSRPBaseURL - the openSRP api base url
 * @param urlParams - search params to be added to request
 * @param service - openSRP service class
 * @param endpoint - the openSRP endpoint
 */
export async function loadCount(
  dispatcher?: (response: number) => void,
  openSRPBaseURL: string = OPENSRP_API_BASE_URL,
  urlParams: URLParams = defaultCountParams,
  service: typeof OpenSRPService = OpenSRPService,
  endpoint: string = LOCATIONS_COUNT_ALL_ENDPOINT
) {
  const serve = new service(endpoint, openSRPBaseURL);
  return serve
    .list(urlParams)
    .then((response: CountResponse) => {
      const resData = response.count;
      if (!dispatcher) {
        return resData;
      }
      dispatcher(resData);
    })
    .catch((e) => {
      throw e;
    });
}
