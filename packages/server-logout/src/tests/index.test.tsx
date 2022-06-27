import { logout, Payload } from '..';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const payload: Payload = {
  method: 'GET',
  headers: {
    authorization: 'Bearer <token>',
  },
};
const opensrpLogoutUri = 'https://global.smartregister.org/opensrp/logout.do';
const keycloakLogoutUri = 'https://keycloak.smartregister.org/realm/camelot/openid-connect/logout';
const redirectUri = 'https://opensrp-web.smartregister.org';

describe('gatekeeper/utils/logoutFromAuthServer', () => {
  afterEach(() => {
    fetch.resetMocks();
  });
  it('invokes all the required stuff', async () => {
    fetch.once(JSON.stringify('logged off'), { status: 200 });
    delete window.location;
    const hrefMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.location as any) = {
      set href(url: string) {
        hrefMock(url);
      },
    };

    logout(payload, keycloakLogoutUri, redirectUri, opensrpLogoutUri).catch(() => fail());
    await new Promise((resolve) => setTimeout(resolve));

    expect(fetch.mock.calls).toEqual([
      [
        'https://global.smartregister.org/opensrp/logout.do',
        {
          headers: {
            authorization: 'Bearer <token>',
          },
          method: 'GET',
        },
      ],
    ]);
    expect(hrefMock).toHaveBeenCalledWith(
      'https://keycloak.smartregister.org/realm/camelot/openid-connect/logout?'
    );
    hrefMock.mockRestore();
    fetch.mockRestore();

    logout(payload, keycloakLogoutUri, redirectUri, undefined, 'id_token_hint').catch(() => fail());
    await new Promise((resolve) => setTimeout(resolve));

    expect(fetch.mock.calls).toEqual([]);
    expect(hrefMock).toHaveBeenCalledWith(
      'https://keycloak.smartregister.org/realm/camelot/openid-connect/logout?id_token_hint=id_token_hint&post_logout_redirect_uri=https://opensrp-web.smartregister.org'
    );
  });
});
