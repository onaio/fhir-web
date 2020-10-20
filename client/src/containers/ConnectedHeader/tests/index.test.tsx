import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedHeader from '..';
import { store } from '@opensrp/store';

jest.mock('../../../configs/env');

describe('components/ConnectedHeader', () => {
  it('renders the ConnectedHeader component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Header').props()).toMatchSnapshot();
  });

  it('renders the ConnectedHeader when logged in', () => {
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
          <ConnectedHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Header').props()).toMatchSnapshot();
    wrapper.unmount();
  });

  const env = process.env;
  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
  });

  afterEach(() => {
    process.env = { ...env }; // make a copy
  });

  it('renders the Language switcher', () => {
    process.env.REACT_APP_LANGUAGE_SWITCHER = 'true';
    console.warn(
      process.env.REACT_APP_LANGUAGE_SWITCHER,
      process.env.REACT_APP_LANGUAGE_SWITCHER === 'true'
    );

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedHeader />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('Header').props()).toMatchSnapshot();
  });
});
