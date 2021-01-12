import { authenticateUser } from '@onaio/session-reducer';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import ConnectedSidebar from '..';
import { store } from '@opensrp/store';
import { MISSIONS } from '../../../constants';

describe('components/ConnectedSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ConnectedSidebar component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('aside').props()).toMatchSnapshot();
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
  });

  it('Test order of menu', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_PRODUCT_CATALOGUE = 'true';
    envModule.ENABLE_PLANS = 'true';
    envModule.ENABLE_LOCATIONS = 'true';
    envModule.ENABLE_FORM_CONFIGURATION = 'true';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(`Menu`).last().prop('children')).toMatchSnapshot();
  });

  it('displays menu links for enabled Plans module', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_PLANS = 'true';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(`SubMenu[title="${MISSIONS}"]`)).toHaveLength(1);
  });

  it('displays menu links for enabled Product Cataglogue module', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_PRODUCT_CATALOGUE = 'true';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );

    const x = (wrapper
      .find('SubMenu[title="Admin"]')
      .first()
      .last()
      .prop('children') as ReactWrapper[])[2].key;

    expect(x).toMatch('product-catalogue');
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

    const x = (wrapper
      .find('SubMenu[title="Admin"]')
      .first()
      .last()
      .prop('children') as ReactWrapper[])[3].key;

    expect(x).toMatch('admin-locations');
  });

  it('displays menu links for enabled Form Configuration module', () => {
    const envModule = require('../../../configs/env');
    envModule.ENABLE_FORM_CONFIGURATION = 'true';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedSidebar />
        </MemoryRouter>
      </Provider>
    );

    const x = (wrapper
      .find('SubMenu[title="Admin"]')
      .first()
      .last()
      .prop('children') as ReactWrapper[])[4].key;

    expect(x).toMatch('admin-form-config');
  });
});
