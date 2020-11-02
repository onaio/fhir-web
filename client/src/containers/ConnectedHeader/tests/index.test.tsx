import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedHeader from '..';
import { store } from '@opensrp/store';

jest.mock('../../../../.env');
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

  it('renders the Language switcher', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedHeader />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[title="Language"]').length).toBeGreaterThan(1);
  });
});
