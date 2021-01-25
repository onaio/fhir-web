import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedSidebar from '..';
import { store } from '@opensrp/store';

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
    envModule.ENABLE_LOCATIONS = 'true';

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

  it('correctly expand teams menu', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_TEAMS = 'true';

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
});
