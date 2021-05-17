import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import reducerRegistry from '@onaio/redux-reducer-registry';
import * as notifications from '@opensrp/notifications';
import {
  releasesReducer,
  releasesReducerName,
  removeManifestReleases,
} from '@opensrp/form-config-core';
import { fixManifestReleases, manifestRelease4 } from '../../../helpers/fixtures';
import { ReleaseList } from '..';
import lang from '../../../lang';

const history = createBrowserHistory();
const mockHistoryPush = jest.fn();
history.push = mockHistoryPush;

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

reducerRegistry.register(releasesReducerName, releasesReducer);

const props = {
  opensrpBaseURL: 'https://test-example.com/rest/',
  uploadFileURL: '/form-upload',
  history,
  location: {
    hash: '',
    pathname: `/releases`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: '/releases',
    url: `/releases`,
  },
  viewReleaseURL: '/releases',
};

describe('components/Antd/ReleaseList', () => {
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

  afterEach(() => {
    store.dispatch(removeManifestReleases());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );

    // Displays loader before fetch finishes
    expect(wrapper.find('Spin')).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/manifest`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    const content = wrapper.find('div.layout-content');
    expect(content.find('Title').props()).toMatchSnapshot('title');
    expect(content.find('Card').prop('children')).toHaveLength(3);
    expect(content.find('Card').prop('children')[0]).toMatchSnapshot('search');
    expect(content.find('Card').prop('children')[1]).toMatchSnapshot('upload button');
    expect(content.find('Card').prop('children')[2]).toMatchSnapshot('table');
    wrapper.unmount();
  });

  it('searches correctly', async () => {
    fetch.once(JSON.stringify([...fixManifestReleases, manifestRelease4]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    const search = wrapper.find('input#search');
    // Before search
    expect(wrapper.find('tbody').find('tr')).toHaveLength(4);

    // Search by appId
    search.simulate('change', { target: { value: 'foo' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);

    // Reset
    search.simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(4);

    // Search by identifier
    search.simulate('change', { target: { value: '1.0.11' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);

    // Reset
    search.simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(4);

    // Search by appVersion
    search.simulate('change', { target: { value: '1.2.14' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(2);

    wrapper.unmount();
  });

  it('handles failure if fetching releases fails', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
    expect(wrapper.find('tbody').find('tr').find('td').find('div.ant-empty-image')).toHaveLength(1);

    wrapper.unmount();
  });

  it('renders correctly if releases fetch is empty', async () => {
    fetch.once(JSON.stringify([]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('tbody').find('tr').find('td').find('div.ant-empty-image')).toHaveLength(1);

    wrapper.unmount();
  });

  it('upload file button works', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ReleaseList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('Space').at(1).find('button').simulate('click');

    expect(mockHistoryPush).toHaveBeenCalledWith('/form-upload');

    wrapper.unmount();
  });
});
