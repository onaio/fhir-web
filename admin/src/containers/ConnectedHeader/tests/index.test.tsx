import { authenticateUser } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedHeader from '..';
import { store } from '@opensrp/store';
import toJson from 'enzyme-to-json';
import { opensrpI18nInstance } from '@opensrp/i18n';

jest.mock('../../../configs/env');

jest.mock('@opensrp/pkg-config', () => {
  const actual = jest.requireActual('@opensrp/pkg-config');
  return {
    ...actual,
    getConfig: () => {
      return 'en';
    },
  };
});

describe('components/ConnectedHeader', () => {
  beforeAll(async () => {
    await opensrpI18nInstance.init();
  });

  it('renders the ConnectedHeader component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('.app-header')).toHaveLength(3);
    expect(wrapper.find('LanguageSwitcher')).toHaveLength(1);
    expect(wrapper.find('Header').props().children).toHaveLength(2);
    expect(wrapper.text()).toMatchInlineSnapshot(`"Login"`);
    expect(toJson(wrapper.find('button[data-index="login-button"]'))).toMatchSnapshot(
      'login button'
    );
    (wrapper.find('Header').props().children as any).forEach((child: any) => {
      expect(child).toMatchSnapshot('child');
    });
    wrapper.unmount();
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
    expect(wrapper.find('.app-header')).toHaveLength(3);
    expect(wrapper.find('LanguageSwitcher')).toHaveLength(1);
    expect(wrapper.find('Header').props().children).toHaveLength(2);
    expect(wrapper.text()).toMatchInlineSnapshot(`"RobertBaratheonRobertBaratheon"`);
    wrapper.unmount();
  });
});
