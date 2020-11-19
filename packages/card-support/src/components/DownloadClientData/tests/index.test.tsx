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
/* eslint-disable react/prop-types */

const history = createBrowserHistory();

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

describe('components/DownloadClientData', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: accessToken, state: 'abcde' } }
      )
    );
  });

  const opensrpBaseURL = 'https://unicef-tunisia-stage.smartregister.org/opensrp/rest';
  const accessToken = 'hunter2';
  const opensrpServiceClass = OpenSRPService;
  const props = {
    accessToken,
    opensrpBaseURL,
    opensrpServiceClass,
    fetchAllHierarchiesActionCreator: locationHierachyDucks.fetchAllHierarchies,
  };

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
    fetch.mockOnce(JSON.stringify(fixtures.userAssignment));
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
    });

    wrapper.update();

    expect(fetch.mock.calls[0]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/organization/user-assignment`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/location/hierarchy/${fixtures.userAssignment.jurisdictions[0]}?is_jurisdiction=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(wrapper.find('Title').props()).toMatchSnapshot('title');
    expect(wrapper.find('Card').props()).toMatchSnapshot('card');
    wrapper.unmount();
  });

  it('submit is disabled until date range is selected', async () => {
    fetch.mockOnce(JSON.stringify(fixtures.userAssignment));
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
    });
    wrapper.update();
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
    const papaparseMock = jest.spyOn(Papaparse, 'unparse');
    fetch.mockOnce(JSON.stringify(fixtures.userAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child, fixtures.child2]));

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
      target: { value: ['2020-01-01', '2020-04-31'] },
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

    expect(fetch.mock.calls[2]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?startDate=2020-01-01&endDate=2020-04-31&registration_location=e2b4a441-21b5-4d03-816b-09d45b17cad7&attribute=card_status:needs_card`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.csvEntry1, fixtures.csvEntry2], {
      header: true,
    });
  });

  it('submits if location and card status are not entered', async () => {
    const papaparseMock = jest.spyOn(Papaparse, 'unparse');
    fetch.mockOnce(JSON.stringify(fixtures.userAssignment));
    fetch.mockOnce(JSON.stringify(fixtures.locationHierarchy));
    fetch.mockOnce(JSON.stringify([fixtures.mother, fixtures.child, fixtures.child2]));

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
      target: { value: ['2020-01-01', '2020-04-31'] },
    });

    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[2]).toEqual([
      `https://unicef-tunisia-stage.smartregister.org/opensrp/rest/client/search?startDate=2020-01-01&endDate=2020-04-31`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(papaparseMock).toBeCalledWith([fixtures.csvEntry1, fixtures.csvEntry2], {
      header: true,
    });
  });
});
