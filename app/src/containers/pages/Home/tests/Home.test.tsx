import { history } from '@onaio/connected-reducer-registry';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import { Home } from '../Home';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { cleanup, render, screen } from '@testing-library/react';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('../../../../configs/env');
jest.mock('../../../../configs/settings');

describe('containers/pages/Home', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders Home correctly & changes Title of page', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    screen.getByText(/Missing require permissions to view data on this page/i);
  });

  it('renders Home correctly & changes Title of page 2', () => {
    store.dispatch(
      authenticateUser(
        true,
        { email: 'bob@example.com', name: 'Bobbie', username: 'RobertBaratheon' },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_LOCATIONS = true;
    envModule.ENABLE_TEAMS = true;
    envModule.ENABLE_INVENTORY = true;
    envModule.ENABLE_FORM_CONFIGURATION = true;
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
    envModule.ENABLE_PRODUCT_CATALOGUE = true;
    envModule.ENABLE_PLANS = true;
    envModule.ENABLE_CARD_SUPPORT = true;
    envModule.ENABLE_USER_MANAGEMENT = true;
    envModule.ENABLE_LOCATIONS = true;
    envModule.ENABLE_TEAMS = true;
    envModule.OPENSRP_ROLES = {
      USERS: 'ROLE_EDIT_KEYCLOAK_USERS',
      PLANS: 'ROLE_VIEW_KEYCLOAK_USERS',
      CARD_SUPPORT: 'ROLE_VIEW_KEYCLOAK_USERS',
      PRODUCT_CATALOGUE: 'ROLE_VIEW_KEYCLOAK_USERS',
      FORM_CONFIGURATION: 'ROLE_VIEW_KEYCLOAK_USERS',
      LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
      INVENTORY: 'ROLE_VIEW_KEYCLOAK_USERS',
      TEAMS: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    render(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    const links = [...screen.queryAllByRole('link')];
    expect(links.map((x) => x.textContent)).toEqual([
      'Card Support',
      'Form Configuration',
      'Inventory',
      'Location Management',
      'Plans',
      'Product Catalogue',
      'Team Management',
    ]);
    links.forEach((link) => {
      expect(link).toMatchSnapshot(link.textContent ?? undefined);
    });
  });
});
