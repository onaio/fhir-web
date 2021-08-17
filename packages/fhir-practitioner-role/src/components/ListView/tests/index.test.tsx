import React from 'react';
import { Provider } from 'react-redux';
import { PractitionerRoleList, deletePractitionerRole, usePractitionerRolesHook } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import nock from 'nock';
import flushPromises from 'flush-promises';
import * as reactQuery from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { practitionerRoles } from './fixtures';
import { mount, shallow } from 'enzyme';
import * as fhirCient from 'fhirclient';
import toJson from 'enzyme-to-json';
import { URL_PRACTITIONER_ROLE } from '../../../constants';
import { createWrapper, renderWithClient } from './utils';
import Client from 'fhirclient/lib/Client';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

const practitionerRoleProps = {
  history,
  PractitionerRolePageSize: 5,
  location: {
    hash: '',
    pathname: `${URL_PRACTITIONER_ROLE}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { practitionerRoleId: undefined },
    path: `${URL_PRACTITIONER_ROLE}`,
    url: `${URL_PRACTITIONER_ROLE}`,
  },
};

describe('Practitioner Role list view', () => {
  beforeAll(() => {
    nock('https://r4.smarthealthit.org').get('/PractitionerRole').reply(200, practitionerRoles);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders practitioner roles table without crashing', async () => {
    shallow(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <PractitionerRoleList
            {...practitionerRoleProps}
            fhirBaseURL="https://r4.smarthealthit.org/"
          />
        </QueryClientProvider>
      </Router>
    );
  });

  it('renders table correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new Client({} as any, {
      serverUrl: 'https://r4.smarthealthit.org/',
    });

    const result = await client.request({
      includeResponse: true,
      url: 'PractitionerRole',
    });

    // expect(result.body).toEqual('');

    const fhir = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(result.body),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <PractitionerRoleList
              {...practitionerRoleProps}
              fhirBaseURL="https://r4.smarthealthit.org/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(requestMock.mock.calls).toEqual([
      ['PractitionerRole/_search?_count=5&_getpagesoffset=0'],
    ]);
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();
    expect(wrapper.text()).toMatchSnapshot();

    // test sorting
    // find table (sorted by default order)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows - default order ${index}`);
    });

    // sort by practitioner name
    // click on sort to change the order (ascending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(
        `sorted table rows by practitioner nam - ascending ${index}`
      );
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(
        `sorted table rows by practitioner name name - descending ${index}`
      );
    });

    // sort by org name
    // click on sort to change the order (ascending)
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by org name - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by org name - descending ${index}`);
    });

    // cancel sort
    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');

    // look for pagination
    expect(wrapper.find('Pagination').at(0).text()).toMatchInlineSnapshot(`"12345 / pageGo to"`);
    wrapper.find('.ant-pagination-item-2').simulate('click');
    expect(wrapper.text()).toMatchSnapshot();

    wrapper.unmount();
  });

  it('correctly redirects to practitioner role detail view url', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(practitionerRoles),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <PractitionerRoleList
              {...practitionerRoleProps}
              fhirBaseURL="https://r4.smarthealthit.org/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    wrapper.update();

    wrapper.find('Dropdown').at(0).simulate('click');
    wrapper.update();
    wrapper.find('.viewdetails').at(0).simulate('click');
    wrapper.update();
    // Redirect to practitioner role detail view
    expect(history.location.pathname).toEqual('/admin/PractitionerRole/388');
  });

  it('successful query component', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(practitionerRoles),
        };
      })
    );
    const result = renderWithClient(
      <Router history={history}>
        <PractitionerRoleList
          {...practitionerRoleProps}
          fhirBaseURL="https://r4.smarthealthit.org/"
        />
      </Router>
    );
    await waitFor(() => result.getAllByText(/OpenSRP web Test Organisation/));
  });

  it('successfully deletes practitioner role', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(practitionerRoles),
          delete: jest.fn().mockResolvedValue('Success'),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <PractitionerRoleList
              {...practitionerRoleProps}
              fhirBaseURL="https://r4.smarthealthit.org/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    wrapper.find('.more-options').at(0).simulate('click');
    wrapper.update();
    wrapper.find('Button').at(2).simulate('click');
    expect(wrapper.find('Button').at(2).text()).toEqual('Delete');
    wrapper.update();
    // check pop up text
    expect(wrapper.find('.ant-popover-content').at(0).text()).toMatchInlineSnapshot(
      `"Are you sure you want to delete this Practitioner Role?NoYes"`
    );
    const popconfirm = wrapper.find('.ant-popover-content').at(0);
    popconfirm.find('Button').at(1).simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(notificationSuccessMock.mock.calls).toEqual([
      ['Successfully Deleted Practitioner Role'],
    ]);
  });

  it('handles failed practitioner role deletion', async () => {
    const notificationErrorsMock = jest.spyOn(notifications, 'sendErrorNotification');
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          delete: jest.fn().mockRejectedValue('Failed'),
        };
      })
    );
    await deletePractitionerRole('https://r4.smarthealthit.org/', '308');

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorsMock.mock.calls).toEqual([['An error occurred']]);
  });
});

describe('hooks', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('successful fetchPractitionerRoles query hook', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(practitionerRoles),
        };
      })
    );
    const { result, waitFor } = renderHook(
      () => usePractitionerRolesHook('https://r4.smarthealthit.org/', 20, 0, jest.fn()),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => result.current.isFetched);

    expect(result.current.data).toBe(practitionerRoles);
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
            <PractitionerRoleList
              {...practitionerRoleProps}
              fhirBaseURL="https://r4.smarthealthit.org/"
            />
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
