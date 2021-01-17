/* eslint-disable @typescript-eslint/camelcase */
export const userAuthData = {
  roles: ['ROLE_OPENMRS'],
  email: null,
  username: 'superset-user',
  user_id: '301faf1d-6cfb-4ed1-997c-46b44146ab05',
  preferred_name: 'Superset User',
  family_name: 'User',
  given_name: 'Superset',
  email_verified: false,
  oAuth2Data: {
    access_token: '12356',
    expires_in: 3600,
    refresh_expires_in: 2592000,
    refresh_token: 'eyJhbGciOiJI',
    token_type: 'bearer',
    'not-before-policy': 1595266243,
    session_state: 'c273b697-72e9-4026-854d-d088655ac467',
    scope: 'profile email',
    token_expires_at: '2021-01-02T14:11:20.102Z',
    refresh_expires_at: '2021-02-02T14:10:20.102Z',
  },
};

export const refreshTokenResponse = {
  gatekeeper: {
    success: true,
    result: {},
  },
  session: {
    authenticated: true,
    extraData: {
      ...userAuthData,
      oAuth2Data: {
        ...userAuthData.oAuth2Data,
        access_token: 'refreshed-i-feel-new',
      },
    },
    user: {
      email: '',
      gravatar: '',
      name: '',
      username: 'superset-user',
    },
  },
};
