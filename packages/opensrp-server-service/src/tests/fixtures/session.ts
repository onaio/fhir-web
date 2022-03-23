/* eslint-disable @typescript-eslint/naming-convention */

export const OpenSRPAPIResponse = {
  oAuth2Data: {
    access_token: 'hunter2',
    expires_in: '3599',
    state: 'opensrp',
    token_type: 'bearer',
  },
  preferredName: 'Superset User',
  roles: ['Provider'],
  userName: 'superset-user',
};

export const sampleErrorObj = {
  message: 'The server encountered an error processing the request.',
  status: '500 INTERNAL_SERVER_ERROR',
  data: null,
  success: false,
};
