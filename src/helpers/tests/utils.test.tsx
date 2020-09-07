import * as gatekeeper from '@onaio/gatekeeper';
import { oAuthUserInfoGetter } from '../utils';
import { OPENSRP_OAUTH_STATE } from '../../configs/env';

jest.mock('@onaio/gatekeeper', () => ({
  getOnadataUserInfo: jest.fn(),
  getOpenSRPUserInfo: jest.fn(),
}));

describe('helpers/utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('oAuthUserInfoGetter works for OpenSRP', () => {
    const mock = jest.spyOn(gatekeeper, 'getOpenSRPUserInfo');
    const resp = { foo: 'bar', oAuth2Data: { state: OPENSRP_OAUTH_STATE } };
    oAuthUserInfoGetter(resp);
    expect(mock).toHaveBeenCalledWith(resp);
    mock.mockRestore();
  });
});
