import {
  OpenSRPService,
  getFetchOptions,
  URLParams,
  throwHTTPError,
} from '@opensrp/server-service';

export const getToken = (getPayload: typeof getFetchOptions): string => {
  const { headers } = getPayload(new AbortController().signal, 'POST');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (headers as any).authorization || (headers as any).Authorization;
};

/**
 * extends class OpenSRPService
 */
export class OpenSRPServiceExtend extends OpenSRPService {
  public token: string;
  constructor(
    baseURL: string,
    endpoint: string,
    getPayload: typeof getFetchOptions = getFetchOptions
  ) {
    super(baseURL, endpoint, getPayload);
    this.token = getToken(getPayload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async postData(data: any, params: URLParams | null = null) {
    const url = OpenSRPService.getURL(`${this.generalURL}`, params);
    const response = await fetch(url, {
      body: data,
      headers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Authorization: this.token,
      },
      method: 'POST',
    });

    if (response.ok || response.status === 201) {
      return {};
    }
    const defaultMessage = `OpenSRPService create on ${this.endpoint} failed, HTTP status ${response.status}`;
    await throwHTTPError(response, defaultMessage);
  }
}
