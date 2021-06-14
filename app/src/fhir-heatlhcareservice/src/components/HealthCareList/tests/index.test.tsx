import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import React from 'react';
import TeamsView, { loadSingleTeam } from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { org1, org2, practitioners, teamMember } from '../../../fixtures';
import { notification } from 'antd';
import lang from '../../../lang';
import { ProcessFHIRObject } from '../../../utils';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

describe('components/TeamsView', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <TeamsView fhirbaseURL="" />
      </Router>
    );
  });

  it('renders fetched data correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(teamMember));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <TeamsView fhirbaseURL="BaseUrl" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock).toMatchInlineSnapshot(`
      Object {
        "calls": Array [],
        "instances": Array [],
        "invocationCallOrder": Array [],
        "results": Array [],
      }
    `);

    expect(wrapper.find('table')).toBeTruthy();

    wrapper.unmount();
  });

  it('loadSingleTeam correctly', async () => {
    fetch.once(JSON.stringify(practitioners));

    const mockfn = jest.fn();
    loadSingleTeam({
      team: { ...ProcessFHIRObject(org1), key: 'key' },
      fhirbaseURL: '',
    }).then(mockfn);

    await act(async () => {
      await flushPromises();
    });

    expect(mockfn).toHaveBeenCalledWith({
      ...ProcessFHIRObject(org1),
      key: 'key',
      practitioners: [{}],
    });
  });

  it('test error thrown if API is down', async () => {
    const mockNotificationError = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
    loadSingleTeam({
      team: { ...ProcessFHIRObject(org2), key: 'key' },
      fhirbaseURL: '',
    });

    mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <TeamsView fhirbaseURL="" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: lang.ERROR_OCCURRED,
    });
  });
});
