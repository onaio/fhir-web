/** Modifies the name field for our custom Error classes */
class BaseError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

/**
 * used when we have an error arising from a non-200 http status
 * code in the response. It returns the error message or json description
 * provided by the api as part of the error object
 */
export class HTTPError extends BaseError {
  public statusCode: number;
  public statusText: string;
  public url: string;
  public description: string;
  constructor(response: Response, object: string, serviceDescription?: string) {
    super();
    this.statusCode = response.status;
    this.statusText = response.statusText;
    this.description = object;
    this.url = response.url;
    if (serviceDescription) {
      this.message = serviceDescription;
    }
  }
}

/** Used to return an error arising from a failed network request */
export class NetworkError extends BaseError {}

/**
 * helper function that reads a non-200 response and creates
 * our custom HTTPError object from it
 *
 * @param {Response} response - the response returned
 * @param {string} customMessage - custom error message
 */
export const throwHTTPError = async (response: Response, customMessage?: string): Promise<void> => {
  const responseClone1 = response.clone();

  await responseClone1.text().then((apiErrRes: string) => {
    throw new HTTPError(response, apiErrRes, customMessage);
  });
};

/**
 * a helper to create NetworkError objects, logic is a bit fuzzy since
 * only error.name is standardized across browsers when a network error happens
 *
 * @param {Error} err - error object
 */
export const throwNetworkError = (err: Error): void => {
  if (err.name === 'TypeError') {
    throw new NetworkError();
  }
  // for all other errors, just throw.
  throw err;
};
