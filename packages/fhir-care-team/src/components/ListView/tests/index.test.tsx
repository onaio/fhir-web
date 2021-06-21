import React from 'react';
import { Provider } from 'react-redux';
import { CareTeamList, useCareTeamsHook } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import * as reactQuery from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { careTeams } from './fixtures';
import { mount, shallow } from 'enzyme';
import * as fhirCient from 'fhirclient';
import toJson from 'enzyme-to-json';
import { URL_CARE_TEAM } from '../../../constants';
import { createWrapper, renderWithClient } from './utils';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

const careTeamProps = {
  history,
  location: {
    hash: '',
    pathname: `${URL_CARE_TEAM}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { careTeamId: null },
    path: `${URL_CARE_TEAM}`,
    url: `${URL_CARE_TEAM}`,
  },
};

describe('Patients list view', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders patients table without crashing', async () => {
    shallow(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <CareTeamList {...careTeamProps} fhirBaseURL="https://r4.smarthealthit.org/" />
        </QueryClientProvider>
      </Router>
    );
  });

  it('renders correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(careTeams),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <CareTeamList {...careTeamProps} fhirBaseURL="https://r4.smarthealthit.org/" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();
    expect(wrapper.text()).toMatchSnapshot();

    // test sorting
    // find table (sorted by default order)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows - default order ${index}`);
    });

    // sort by username
    // click on sort to change the order (ascending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by name - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by name - descending ${index}`);
    });

    // cancel sort
    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // sort by dob
    // click on sort to change the order (ascending)
    expect(wrapper.find('thead tr th').at(1).text()).toEqual('Date Of Birth');
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();
    // check new sort order by dob (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by dob - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();

    // check new sort order by email (descending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by dob - descending ${index}`);
    });
    wrapper.update();
    // sort by gender
    // click on sort to change the order (ascending)
    wrapper.find('thead tr th').at(2).simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by gender - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').at(2).simulate('click');
    wrapper.update();

    // check new sort order by name (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by gender - descending ${index}`);
    });

    // cancel sort
    // click on sort to change the order (descending)
    wrapper.find('thead tr th').at(2).simulate('click');
    wrapper.unmount();
  });

  it('correctly redirects to care team detail view url', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(careTeams),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <CareTeamList {...careTeamProps} fhirBaseURL="https://r4.smarthealthit.org/" />
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
    // Redirect to care team detail view
    expect(history.location.pathname).toEqual('/admin/CareTeams/308');
  });

  it('successful query component', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(careTeams),
        };
      })
    );
    const result = renderWithClient(
      <Router history={history}>
        <CareTeamList {...careTeamProps} fhirBaseURL="https://r4.smarthealthit.org/" />
      </Router>
    );
    await waitFor(() => result.getByText(/Care Team One/));
  });
});

describe('hooks', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('successful query hook', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(careTeams),
        };
      })
    );
    const { result, waitFor } = renderHook(
      () => useCareTeamsHook('https://r4.smarthealthit.org/'),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => result.current.isFetched);

    expect(result.current.data).toBe(careTeams);
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
            <CareTeamList {...careTeamProps} fhirBaseURL="https://r4.smarthealthit.org/" />
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
