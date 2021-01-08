import { OpenSRPService } from '../dataLoaders';
import fetch from 'jest-fetch-mock';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';

describe('dataLoaders/OpenSRPService', () => {
  const baseURL = 'https://test.smartregister.org/opensrp/rest/';
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('OpenSRPService generic class constructor works', async () => {
    const planService = new OpenSRPService('organization', baseURL);
    expect(planService.baseURL).toEqual(baseURL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(`${baseURL}organization`);
  });

  it('works with default base url', async () => {
    const planService = new OpenSRPService('organization');
    expect(planService.baseURL).toEqual(OPENSRP_API_BASE_URL);
    expect(planService.endpoint).toEqual('organization');
    expect(planService.generalURL).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization'
    );
  });
});
