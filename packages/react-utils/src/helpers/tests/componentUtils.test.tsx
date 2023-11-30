/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { MemoryRouter } from 'react-router';
import * as componentUtils from '../componentUtils';
import { mount } from 'enzyme';
import { Resource404 } from '../../components/Resource404';

const { PublicComponent, isAuthorized } = componentUtils;

const realLocation = window.location;

// tslint:disable-next-line: no-var-requires

describe('componentUtils', () => {
  beforeEach(() => {
    window.location = realLocation;
    // Reset history
    history.push('/');
  });

  it('PublicComponent Renders correctly', () => {
    const MockComponent = () => {
      return <Resource404 />;
    };
    const props = { exact: true, path: '/unknown', authenticated: false };
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/unknown`, hash: '', search: '', state: {} }]}>
        <PublicComponent {...props} component={MockComponent} />
      </MemoryRouter>
    );

    expect(wrapper.exists(MockComponent)).toBeTruthy();
    wrapper.unmount();
  });

  it('isAuthorized works correctly', async () => {
    let isUserAuthorized = isAuthorized(
      ['ROLE_VIEW_KEYCLOAK_USERS', 'ROLE_EDIT_KEYCLOAK_USERS'],
      ['ROLE_VIEW_KEYCLOAK_USERS']
    );
    expect(isUserAuthorized).toBeTruthy();
    isUserAuthorized = isAuthorized(
      ['ROLE_VIEW_KEYCLOAK_USERS', 'ROLE_EDIT_KEYCLOAK_USERS'],
      ['unauthorized']
    );
    expect(isUserAuthorized).toBeFalsy();
  });
});
