import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import { ViewDetails } from '..';
import * as fixtures from './fixtures';
import { createBrowserHistory } from 'history';
import { URL_USER_GROUPS } from '../../../constants';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import lang from '../../../lang';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('View User Group Details', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.mockClear();
  });

  it('works correctly', async () => {
    fetch.once(JSON.stringify(fixtures.members)).once(JSON.stringify(fixtures.userGroup1));
    const props = {
      groupId: fixtures.userGroup1.id,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };

    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('nominal display');
    // att test case to capture space element props snapshot
    expect(wrapper.find('ViewDetails Space').props()).toMatchSnapshot('space element');
    wrapper.unmount();
  });

  it('fetches user group details correctly', async () => {
    fetch.once(JSON.stringify(fixtures.members)).once(JSON.stringify(fixtures.userGroup1));
    const props = {
      groupId: fixtures.userGroup1.id,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/261c67fe-918b-4369-a35f-095b5e284fcb/members',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/261c67fe-918b-4369-a35f-095b5e284fcb',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check that detail view is rendered
    expect(toJson(wrapper.find('.view-details-content'))).toBeTruthy();
  });

  it('detail view without groupId', () => {
    const props = {
      groupId: '',
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );
    expect(toJson(wrapper.find('.view-details-content'))).toMatchSnapshot('Should be null');
    wrapper.unmount();
  });

  it('works when GroupId is present but user group members/details isnt', async () => {
    fetch.once(JSON.stringify(null)).once(JSON.stringify({}));
    const props = {
      groupId: fixtures.userGroup1.id,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
    wrapper.unmount();
  });

  it('Closes on clicking cancel (X) ', () => {
    const props = {
      groupId: fixtures.userGroup1.id,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    // simulate clicking on close button
    act(() => {
      wrapper.find('.flex-right button').simulate('click');
    });

    expect(wrapper.props().history.location.pathname).toEqual(URL_USER_GROUPS);
    wrapper.unmount();
  });

  it('shows error notification when fetching group details fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    fetch.once(JSON.stringify(fixtures.userGroup1));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const props = {
      groupId: fixtures.userGroup1.id,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
