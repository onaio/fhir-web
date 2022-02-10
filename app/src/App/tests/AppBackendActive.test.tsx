import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import App from '../App';

jest.mock('../../configs/env', () => ({
  PROJECT_LANGUAGE_CODE: 'eusm',
  SUPPORTED_LANGUAGES: ['en', 'fr'],
  OPENSRP_API_BASE_URL: 'https://test.smartregister.org/opensrp/rest/',
  BACKEND_ACTIVE: true,
  OPENSRP_WEB_VERSION: '',
  OPENSRP_ROLES: {
    USERS: 'ROLE_EDIT_KEYCLOAK_USERS',
    PLANS: 'ROLE_VIEW_KEYCLOAK_USERS',
    LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
    CARD_SUPPORT: 'ROLE_VIEW_KEYCLOAK_USERS',
    INVENTORY: 'ROLE_VIEW_KEYCLOAK_USERS',
    TEAMS: 'ROLE_VIEW_KEYCLOAK_USERS',
    PRODUCT_CATALOGUE: 'ROLE_VIEW_KEYCLOAK_USERS',
    FORM_CONFIGURATION: 'ROLE_VIEW_KEYCLOAK_USERS',
  },
}));

// tslint:disable-next-line: no-var-requires

describe('App with active backend', () => {
  it('renders App correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(`"AdministrationLogin"`);

    await act(async () => {
      await new Promise<unknown>((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/fe/oauth/callback/opensrp',
      },
    });
    wrapper.unmount();
  });
});
