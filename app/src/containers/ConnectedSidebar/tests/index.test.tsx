import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedSidebar from '..';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { getActiveKey } from '../../../components/page/Sidebar/utils';
import { MenuItems } from '../../../components/page/Sidebar';
import toJson from 'enzyme-to-json';
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
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
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
          initialEntries={[{ pathname: `/admin/users/list`, hash: '', search: '', state: {} }]}
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

  it('getActiveMenuKey works correctly', () => {
    const menus = [
      {
        otherProps: { title: 'Inventory' },
        key: 'inventory',
        enabled: true,
        url: 'admin/inventory',
      },
    ];
    const location = ['admin', 'inventory'];

    const activeKey = getActiveKey(menus as MenuItems[], location);
    expect(activeKey).toEqual('');

    // test menu with children
    const menus2 = [
      {
        otherProps: { title: 'Inventory' },
        key: 'inventory',
        enabled: true,
        url: 'admin/inventory',
        children: [
          {
            otherProps: { title: 'active' },
            key: 'active-inventory',
            enabled: true,
            url: 'admin/inventory/active',
            children: [],
          },
        ],
      },
    ];
    const location2 = ['admin', 'inventory', 'active'];
    const activeKey2 = getActiveKey(menus2 as MenuItems[], location2);
    expect(activeKey2).toEqual('active-inventory');
  });
});
