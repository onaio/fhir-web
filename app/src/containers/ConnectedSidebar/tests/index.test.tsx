import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedSidebar from '..';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { getActiveKey } from '../../../components/page/Sidebar/utils';
import toJson from 'enzyme-to-json';
import { Route } from '../../../routes';
jest.mock('../../../configs/env');

describe('components/ConnectedSidebar', () => {
  it('renders the ConnectedSidebar component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('aside').props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders user managment menu for users with appropriate role', () => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('displays menu links for enabled modules', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_LOCATIONS = 'true';
    envModule.ENABLE_TEAMS = 'true';
    envModule.ENABLE_INVENTORY = 'true';
    envModule.ENABLE_FORM_CONFIGURATION = 'true';
    envModule.ENABLE_PRODUCT_CATALOGUE = 'true';
    envModule.ENABLE_PLANS = 'true';
    envModule.ENABLE_CARD_SUPPORT = 'true';
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();

    wrapper.unmount();
  });

  it('displays menu links for enabled Location module', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_LOCATIONS = 'true';
    envModule.OPENSRP_ROLES = {
      LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('correctly expand users menu', () => {
    const envModule = require('../../../configs/env');
    envModule.OPENSRP_ROLES = {
      USERS: 'ROLE_EDIT_KEYCLOAK_USERS',
    };
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('correctly expand location menu', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_LOCATIONS = 'true';
    envModule.OPENSRP_ROLES = {
      LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/location`, hash: '', search: '', state: {} }]}>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').first().prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('correctly expand admin-form-config menu', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_FORM_CONFIGURATION = 'true';
    envModule.OPENSRP_ROLES = {
      FORM_CONFIGURATION: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/draft`, hash: '', search: '', state: {} }]}>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('shows the correct logo', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/draft`, hash: '', search: '', state: {} }]}>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(toJson(wrapper.find('.logo'))).toMatchSnapshot('Logo');
  });

  it('correctly expand teams menu', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_TEAMS = 'true';
    envModule.OPENSRP_ROLES = {
      TEAMS: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: `/admin/teams`, hash: '', search: '', state: {} }]}
        >
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('correctly sets open keys', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: `/admin/users`, hash: '', search: '', state: {} }]}
        >
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    const menu = wrapper.find('Menu').at(0);
    act(() => {
      (menu.prop('onOpenChange') as any)(['admin', 'users']);
      wrapper.update();
    });
    wrapper.update();
    expect((wrapper.find('Menu').at(0).props() as any)['openKeys']).toEqual(['admin', 'users']);
    wrapper.unmount();
  });
});

describe('components/ConnectedSidebar/utils', () => {
  it('getActiveMenuKey works correctly', () => {
    const routes: Route[] = [
      {
        enabled: true,
        key: 'admin',
        title: 'Admin',
        url: '/admin',
        children: [
          {
            key: 'users',
            title: 'Users',
            children: [{ key: 'user-management', title: 'User Management', url: '/admin/users' }],
          },
          {
            key: 'product-catalogue',
            title: 'Product Catalogue',
            url: '/admin/product-catalogue',
          },
          {
            key: 'teams',
            title: 'Teams',
            url: '/admin/teams',
          },
          {
            key: 'location',
            title: 'Locations',
            children: [
              {
                key: 'location-group',
                title: 'Location unit group',
                url: '/admin/location/group',
              },
              {
                key: 'location-unit',
                title: 'Location unit',
                url: '/admin/location/unit',
              },
            ],
          },
        ],
      },
    ];

    // Exactly Match
    expect(getActiveKey('/admin/teams', routes)).toEqual('teams');
    expect(getActiveKey('/admin/product-catalogue', routes)).toEqual('product-catalogue');

    // Partial Matching Url
    expect(getActiveKey('/admin/users/testing-user', routes)).toEqual('user-management');
    expect(getActiveKey('/admin/location/unit/add', routes)).toEqual('location-unit');

    // Not Matching
    expect(getActiveKey('/The/teams', routes)).toEqual(undefined);
    expect(getActiveKey('/testing/user', routes)).toEqual(undefined);
    expect(getActiveKey('/user', routes)).toEqual(undefined);
    expect(getActiveKey('/now/you/See/User', routes)).toEqual(undefined);
  });
});
