import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedSidebar from '..';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { superUserRole } from '@opensrp/react-utils';
import { RoleContext } from '@opensrp/rbac';
import { fireEvent, render } from '@testing-library/react';
import { COLLAPSED_LOGO_SRC, MAIN_LOGO_SRC } from '../../../configs/env';

jest.mock('../../../configs/env');
jest.mock('../../../configs/settings');

describe('components/ConnectedSidebar', () => {
  it('renders the ConnectedSidebar component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('aside').props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders user managment menu for users with appropriate role', () => {
    store.dispatch(
      authenticateUser(true, {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('displays menu links for All Enabled modules', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_LOCATIONS = true;
    envModule.ENABLE_TEAMS = true;
    envModule.ENABLE_INVENTORY = true;
    envModule.ENABLE_FORM_CONFIGURATION = true;
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
    envModule.ENABLE_PRODUCT_CATALOGUE = true;
    envModule.ENABLE_PLANS = true;
    envModule.ENABLE_CARD_SUPPORT = true;
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
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
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
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Menu').at(0).prop('children')).toMatchSnapshot();
    wrapper.unmount();
  });

  it('shows the correct logo & collapse works as expected', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/draft`, hash: '', search: '', state: {} }]}>
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    const mainLogo = document.querySelector("#main-logo")
    expect(mainLogo).toBeVisible() // menu not collapsed
    expect(mainLogo?.querySelector('img')?.getAttribute('src')).toEqual(MAIN_LOGO_SRC)
    const collapseLogo = document.querySelector('#collapsed-logo')
    expect(collapseLogo).not.toBeVisible()
    expect(collapseLogo?.querySelector('img')?.getAttribute('src')).toEqual(COLLAPSED_LOGO_SRC)

    // collapse menu
    const collapseIcon = document.querySelector(".collapse-icon")
    fireEvent.click(collapseIcon as Element)
    expect(document.querySelector("#main-logo")).not.toBeVisible()
    expect(document.querySelector('#collapsed-logo')).toBeVisible()
  });


  it('correctly sets open keys', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: `/admin/users`, hash: '', search: '', state: {} }]}
        >
          <RoleContext.Provider value={superUserRole}>
            <ConnectedSidebar />
          </RoleContext.Provider>
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
