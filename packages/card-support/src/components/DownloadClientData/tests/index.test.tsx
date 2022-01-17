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
          user_id: '0b1010010001010101',
        }
      )
    );
  });

  afterAll(() => {
    global.Date = realDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
    /** @todo A dispatch should be made to remove all hierarchies after each test because
     * each test adds hiearchies to existing hierarchies leading to duplicates, hence
     * the duplicate key warning when running tests
     *
     * Currently, there isn't an action method to remove all hierachies. If one is made
     * available from the package @opensrp/location-management, then it should be used here
     */
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
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders correctly', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.samplePractitioner));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/practitioner/user/0b1010010001010101',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/by-practitioner/3eb4a68a-3a91-4598-84f0-182f52e19675',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans/903594cf-7890-4c64-9e12-143fda948a72',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
    ]);
    const content = wrapper.find('div.layout-content');
    expect(content.find('Title').props()).toMatchSnapshot('title');
    expect(content.find('Card').props()).toMatchSnapshot('card');
    wrapper.unmount();
  });

  it('submit is disabled until date range is selected', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.samplePractitioner));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
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
    wrapper.unmount();
  });

  it('downloads csv correctly', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.samplePractitioner));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
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

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/practitioner/user/0b1010010001010101',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/by-practitioner/3eb4a68a-3a91-4598-84f0-182f52e19675',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans/903594cf-7890-4c64-9e12-143fda948a72',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=e2b4a441-21b5-4d03-816b-09d45b17cad7&attribute=card_status:needs_card',
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
    // File name should be correct
    expect(mockDownload.mock.calls[0][1]).toEqual(
      'Children_list_CSB Hopital Bouficha_18_11_2020_(01-01-2020 - 30-11-2020).csv'
    );
    wrapper.unmount();
  });

  it('submits if card status is not entered', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.samplePractitioner));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
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

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/practitioner/user/0b1010010001010101',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/by-practitioner/3eb4a68a-3a91-4598-84f0-182f52e19675',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans/903594cf-7890-4c64-9e12-143fda948a72',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=e2b4a441-21b5-4d03-816b-09d45b17cad7',
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.child1CsvEntry, fixtures.child2CsvEntry], {
      header: true,
    });
    wrapper.unmount();
  });

  it('uses the default location id if location not selected', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.samplePractitioner));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
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

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/practitioner/user/0b1010010001010101',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/by-practitioner/3eb4a68a-3a91-4598-84f0-182f52e19675',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans/903594cf-7890-4c64-9e12-143fda948a72',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/e2b4a441-21b5-4d03-816b-09d45b17cad7?is_jurisdiction=true',
      'https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?locationIds=e2b4a441-21b5-4d03-816b-09d45b17cad7&attribute=card_status:needs_card',
    ]);
    expect(papaparseMock).toBeCalledWith(
      [{ ...fixtures.child1CsvEntry }, { ...fixtures.child2CsvEntry }],
      {
        header: true,
      }
    );
    wrapper.unmount();
  });

  it('handles fetch error when fetching user assignment', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.USER_NOT_ACTIVE_PRACTITIONER);
    wrapper.unmount();
  });

  it('handles fetch error when fetching user location hierarchy', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeam));
    fetch.mockOnce(JSON.stringify(fixtures.sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child1, fixtures.child2]));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DownloadClientData {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(lang.USER_NOT_ASSIGNED);
    wrapper.unmount();
  });
});
