export const expressAPIResponse = {
  gatekeeper: {
    result: {
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: 1142,
        refresh_token: 'iloveoov',
        scope: 'read write',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['Provider', 'ROLE_VIEW_KEYCLOAK_USERS'],
      username: 'superset-user',
    },
    success: true,
  },
  session: {
    authenticated: true,
    extraData: {
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: 1142,
        refresh_token: 'iloveoov',
        scope: 'read write',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['Provider', 'ROLE_VIEW_KEYCLOAK_USERS'],
      username: 'superset-user',
    },
    user: {
      email: '',
      gravatar: '',
      name: '',
      username: 'superset-user',
    },
  },
};
