import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { ManifestReleases, ConnectedManifestReleases } from '../index';
import { getFetchOptions } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import reducerRegistry from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import {
  releasesReducer,
  releasesReducerName,
  removeManifestReleases,
} from '@opensrp/form-config-core';
import { fixManifestReleases } from '../../../helpers/fixtures';
import toJson from 'enzyme-to-json';
import fetch from 'jest-fetch-mock';
import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';

/** register the reducers */
reducerRegistry.register(releasesReducerName, releasesReducer);

const history = createBrowserHistory();

const baseURL = 'https://test-example.com/rest/';
const endpoint = 'manifest';
const props = {
  baseURL,
  currentUrl: '/releases',
  endpoint,
  formUploadUrl: '/upload',
  getPayload: getFetchOptions,
  LoadingComponent: <div>Loading</div>,
  uploadTypeUrl: 'file',
  customAlert: jest.fn(),
  accessToken: 'hunter2',
};

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

describe('components/Releases', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterAll(() => {
    _.debounce = actualDebounce;
  });

  afterEach(() => {
    store.dispatch(removeManifestReleases());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(<ManifestReleases {...props} />);
  });

  it('renders without crashing when connected to store', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestReleases {...props} />
        </Router>
      </Provider>
    );

    // should display loading component if there is no data
    expect(wrapper.find('div').at(1).text()).toEqual('Loading');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot();
    expect(wrapper.find('SearchForm')).toHaveLength(1);
    expect(wrapper.find('Row Col').at(1).text()).toEqual('Upload New File');

    expect(wrapper.find('.tbody .tr')).toHaveLength(fixManifestReleases.length);

    const viewFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(4).find('a');
    expect(toJson(viewFiledCell)).toMatchSnapshot();
    expect(viewFiledCell.text()).toEqual('View Files');
  });

  it('test search', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestReleases {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // search
    const search = wrapper.find('SearchForm input');
    search.simulate('change', { target: { value: '1.0.12' } });
    wrapper.update();
    expect(wrapper.find('.tbody .tr')).toHaveLength(1);
  });

  it('handles failure when fetching releases', async () => {
    fetch.mockRejectOnce(new Error('API is down'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestReleases {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(props.customAlert).toHaveBeenCalledWith('There was a problem fetching release files', {
      type: 'error',
    });
    expect(wrapper.find('.tbody .tr')).toHaveLength(0);

    wrapper.unmount();
  });
});
