import React from 'react';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { CareTeamList, deleteCareTeam } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import nock from 'nock';
import flushPromises from 'flush-promises';
import * as reactQuery from 'react-query';
import { act } from '@testing-library/react';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { careTeams } from './fixtures';
import { mount } from 'enzyme';
import * as fhirclient from 'fhirclient';
import { URL_CARE_TEAM } from '../../../constants';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

const props = {
  fhirBaseURL: 'https://r4.smarthealthit.org/',
  history,
  careTeamPageSize: 5,
  location: {
    hash: '',
    pathname: `${URL_CARE_TEAM}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { careTeamId: undefined },
    path: `${URL_CARE_TEAM}`,
    url: `${URL_CARE_TEAM}`,
  },
};

describe('Care Teams list view', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('successfully deletes care team', async () => {
    const fhir = jest.spyOn(fhirclient, 'client');
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(careTeams),
          delete: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <RoleContext.Provider value={superUserRole}>
              <CareTeamList {...props} fhirBaseURL="https://r4.smarthealthit.org/" />
            </RoleContext.Provider>
          </QueryClientProvider>
        </Router>
      </Provider>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    wrapper.find('[data-testid="action-dropdown"]').at(0).simulate('click');
    wrapper.update();
    const dropdown = wrapper.find('button[data-testid="deleteBtn"]');
    expect(dropdown).toHaveLength(1);
    dropdown.simulate('click');
    wrapper.update();
    // check pop up text
    expect(wrapper.find('.ant-popover-content').at(0).text()).toMatchInlineSnapshot(
      `"Are you sure you want to delete this Care Team?NoYes"`
    );
    const popconfirm = wrapper.find('.ant-popover-content').at(0);
    popconfirm.find('.ant-btn').at(1).simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(notificationSuccessMock.mock.calls).toEqual([['Successfully Deleted Care Team']]);
  });

  it('handles failed care team deletion', async () => {
    const notificationErrorsMock = jest.spyOn(notifications, 'sendErrorNotification');
    const fhir = jest.spyOn(fhirclient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          delete: jest.fn().mockRejectedValue('Failed'),
        };
      })
    );
    await deleteCareTeam('https://r4.smarthealthit.org/', '308', (t) => t);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorsMock.mock.calls).toEqual([
      ['There was a problem deleting the Care Team'],
    ]);
  });
});

describe('hooks', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('shows broken page if fhir api is down', async () => {
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockImplementation(
      () =>
        ({
          data: undefined,
          error: 'Something went wrong',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <RoleContext.Provider value={superUserRole}>
              <CareTeamList {...props} fhirBaseURL="https://r4.smarthealthit.org/" />
            </RoleContext.Provider>
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
    wrapper.unmount();
  });
});
