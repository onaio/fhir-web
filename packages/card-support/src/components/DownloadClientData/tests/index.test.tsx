/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { DownloadClientData } from '..';
import { OpenSRPService } from '@opensrp/server-service';
import fetch from 'jest-fetch-mock';
import { locationHierachyDucks } from '@opensrp/location-management';
import { shallow, mount } from 'enzyme';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { authenticateUser } from '@onaio/session-reducer';
import Papaparse from 'papaparse';
import * as globalUtils from '../../../helpers/utils';
import * as notifications from '@opensrp/notifications';
import lang from '../../../lang';
import { QueryClient, QueryClientProvider } from 'react-query';
/* eslint-disable react/prop-types */

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const RangePicker = ({ children, onChange, ...otherProps }) => {
    return (
      <select {...otherProps} onChange={(e) => onChange(e.target.value, e.target.value)}>
        {children}
      </select>
    );
  };

  const DatePicker = {
    RangePicker,
  };

  const Select = ({ children, onChange, ...otherProps }) => {
    return (
      <select {...otherProps} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };

  Select.Option = Option;

  const TreeSelect = ({ children, onChange, ...otherProps }) => {
    return (
      <select {...otherProps} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const TreeNode = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };

  TreeSelect.TreeNode = TreeNode;

  return {
    __esModule: true,
    ...antd,
    DatePicker,
    Select,
    TreeSelect,
  };
});
const mockDownload = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalUtils as any).downloadFile = mockDownload;

describe('components/DownloadClientData', () => {
  const currentDate = new Date('2020-11-18');
  const realDate = Date;

  beforeAll(() => {
    // Mock new Date() but do not mock if date passed to constructor i.e
    // mock current date only
    const DateExtend = class extends Date {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(date: any) {
        if (date) {
          super(date);
        } else {
          return currentDate;
        }
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Date = DateExtend;

    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          api_token: 'hunter2',
          oAuth2Data: { access_token: accessToken, state: 'abcde' },
        }
      )
    );
  });

  afterAll(() => {
    global.Date = realDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
    /**
     * @todo A dispatch should be made to remove all hierarchies after each test because
     * each test adds hiearchies to existing hierarchies leading to duplicates, hence
     * the duplicate key warning when running tests
     *
     * Currently, there isn't an action method to remove all hierachies. If one is made
     * available from the package @opensrp/location-management, then it should be used here
     */
    fetch.resetMocks();
  });

  const opensrpBaseURL = 'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/';
  const accessToken = 'hunter2';
  const opensrpServiceClass = OpenSRPService;
  const props = {
    accessToken,
    opensrpBaseURL,
    opensrpServiceClass,
    fetchAllHierarchiesActionCreator: locationHierachyDucks.fetchAllHierarchies,
  };
  const papaparseMock = jest.spyOn(Papaparse, 'unparse');

  it('renders without crashing', () => {
    const queryClient = new QueryClient();

    shallow(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );
  });

  it('renders correctly', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/security/authenticate',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
    ]);

    expect(wrapper.find('Title').text()).toMatchInlineSnapshot(`"Download Client Data"`);
    // bug in toBeInTheDocument() assertion - https://github.com/testing-library/jest-dom/issues/313
    expect(wrapper.find('Form')).toBeTruthy();
    wrapper.unmount();
  });

  it('submit is disabled until date range is selected', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // Submit is disabled if date range is empty
    expect(wrapper.find('Tooltip').prop('title')).toEqual('Select Card Order Date');
    expect(wrapper.find('Tooltip').find('Button').prop('disabled')).toEqual(true);

    // Submit is still disabled if user selects start date without end date
    wrapper.find('select#cardOrderDate').simulate('change', {
      target: { value: ['2020-01-01', ''] },
    });
    wrapper.update();
    expect(wrapper.find('Tooltip').prop('title')).toEqual('Select Card Order Date');
    expect(wrapper.find('Tooltip').find('Button').prop('disabled')).toEqual(true);

    // Submit is enabled if date range is selected
    wrapper.find('select#cardOrderDate').simulate('change', {
      target: { value: ['2020-01-01', '2020-04-31'] },
    });
    wrapper.update();
    expect(wrapper.find('Tooltip').prop('title')).toEqual('');
    expect(wrapper.find('Tooltip').find('Button').prop('disabled')).toEqual(false);
  });

  it('downloads csv correctly', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('select#cardOrderDate').simulate('change', {
      target: { value: ['2020-01-01', '2020-11-30'] },
    });
    wrapper.find('select#cardStatus').simulate('change', {
      target: { value: 'needs_card' },
    });
    wrapper.find('select#clientLocation').simulate('change', {
      target: { value: 'e2b4a441-21b5-4d03-816b-09d45b17cad7' },
    });

    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/security/authenticate',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=325b9549-80fa-4dd0-9cf8-f0538cbebb18,e2b4a441-21b5-4d03-816b-09d45b17cad7,72f8ae88-58c9-40b4-863a-1c7bc6549a8b,52c10f07-6653-470d-9fee-14b0bb111c2a,d309898b-3925-494f-a30c-689222d3fcce,dbacb5dc-c8a3-439d-b407-13ffd570b9ef,27400130-8127-4f54-b14f-e26f20ecae14,14e83edc-5a54-44f5-816e-c96c61b5d911,9c183088-e498-4183-af41-b29bd32d94b6,66c88197-8281-4eb4-ae2e-4a89ae8419ed,1018b255-0889-492c-b5dd-31a50cb3db4d,5d99a60e-126e-4c40-b5ce-439f920de090,9a0e7727-b011-458f-832a-61108b2fe381,70589012-899c-401d-85a1-13fabce26aab,e5631d3e-70c3-4083-ac17-46f9467c6dd5,e447d5bb-8d42-4be4-b91d-b8d185cf81a6,18b3841b-b5b1-4971-93d0-d36ac20c4565,fee237ef-75e8-4ada-b15f-6d1a92633f33,16c58ef5-3b19-4ec2-ba9c-aefac3d08a66,7a663f5e-2619-4a2d-a7df-7250263f47d2,e2b4a441-21b5-4d03-816b-09d45b17cad7&attribute=card_status:needs_card',
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
    // File name should be correct
    expect(mockDownload.mock.calls[0][1]).toEqual(
      'Children_list_CSB Hopital Bouficha_18_11_2020_(01-01-2020 - 30-11-2020).csv'
    );
  });

  it('submits if card status is not entered', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('select#cardOrderDate').simulate('change', {
      target: { value: ['2020-01-01', '2020-11-30'] },
    });

    wrapper.find('select#clientLocation').simulate('change', {
      target: { value: 'e2b4a441-21b5-4d03-816b-09d45b17cad7' },
    });

    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/security/authenticate',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=325b9549-80fa-4dd0-9cf8-f0538cbebb18,e2b4a441-21b5-4d03-816b-09d45b17cad7,72f8ae88-58c9-40b4-863a-1c7bc6549a8b,52c10f07-6653-470d-9fee-14b0bb111c2a,d309898b-3925-494f-a30c-689222d3fcce,dbacb5dc-c8a3-439d-b407-13ffd570b9ef,27400130-8127-4f54-b14f-e26f20ecae14,14e83edc-5a54-44f5-816e-c96c61b5d911,9c183088-e498-4183-af41-b29bd32d94b6,66c88197-8281-4eb4-ae2e-4a89ae8419ed,1018b255-0889-492c-b5dd-31a50cb3db4d,5d99a60e-126e-4c40-b5ce-439f920de090,9a0e7727-b011-458f-832a-61108b2fe381,70589012-899c-401d-85a1-13fabce26aab,e5631d3e-70c3-4083-ac17-46f9467c6dd5,e447d5bb-8d42-4be4-b91d-b8d185cf81a6,18b3841b-b5b1-4971-93d0-d36ac20c4565,fee237ef-75e8-4ada-b15f-6d1a92633f33,16c58ef5-3b19-4ec2-ba9c-aefac3d08a66,7a663f5e-2619-4a2d-a7df-7250263f47d2,e2b4a441-21b5-4d03-816b-09d45b17cad7',
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
  });

  it('uses the default location id if location not selected', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('select#cardOrderDate').simulate('change', {
      target: { value: ['2020-01-01', '2020-11-30'] },
    });
    wrapper.find('select#cardStatus').simulate('change', {
      target: { value: 'needs_card' },
    });

    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/security/authenticate',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=325b9549-80fa-4dd0-9cf8-f0538cbebb18,e2b4a441-21b5-4d03-816b-09d45b17cad7,72f8ae88-58c9-40b4-863a-1c7bc6549a8b,52c10f07-6653-470d-9fee-14b0bb111c2a,d309898b-3925-494f-a30c-689222d3fcce,dbacb5dc-c8a3-439d-b407-13ffd570b9ef,27400130-8127-4f54-b14f-e26f20ecae14,14e83edc-5a54-44f5-816e-c96c61b5d911,9c183088-e498-4183-af41-b29bd32d94b6,66c88197-8281-4eb4-ae2e-4a89ae8419ed,1018b255-0889-492c-b5dd-31a50cb3db4d,5d99a60e-126e-4c40-b5ce-439f920de090,9a0e7727-b011-458f-832a-61108b2fe381,70589012-899c-401d-85a1-13fabce26aab,e5631d3e-70c3-4083-ac17-46f9467c6dd5,e447d5bb-8d42-4be4-b91d-b8d185cf81a6,18b3841b-b5b1-4971-93d0-d36ac20c4565,fee237ef-75e8-4ada-b15f-6d1a92633f33,16c58ef5-3b19-4ec2-ba9c-aefac3d08a66,7a663f5e-2619-4a2d-a7df-7250263f47d2,e2b4a441-21b5-4d03-816b-09d45b17cad7&attribute=card_status:needs_card',
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
  });

  it('handles fetch error when fetching user data - team assignments', async () => {
    fetch.mockRejectOnce(new Error('API is down'));

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    // turn retries off - makes fetch fail on first try
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(
      lang.USER_NOT_ASSIGNED_AND_USERS_TEAM_NOT_ASSIGNED
    );
  });

  it('handles fetch error when fetching user location hierarchy', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockRejectOnce(new Error('API is down'));

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    // turn retries off - makes fetch fail on first try
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DownloadClientData {...props} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
  });
});
