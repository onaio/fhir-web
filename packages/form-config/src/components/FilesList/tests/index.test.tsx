/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { ManifestFilesList, ConnectedManifestFilesList } from '../index';
import { getFetchOptions } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import reducerRegistry from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import * as formConfigCore from '@opensrp/form-config-core';
import { fixManifestFiles, downloadFile } from '../../../helpers/fixtures';
import toJson from 'enzyme-to-json';
import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import lang from '../../../lang';

jest.mock('@opensrp/form-config-core', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/form-config-core')),
}));

const { filesReducer, filesReducerName, removeManifestFiles } = formConfigCore;

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

const history = createBrowserHistory();

const baseURL = 'https://test-example.com/rest/';
const props = {
  baseURL,
  downloadEndPoint: 'form-download',
  endpoint: 'form/related',
  fileUploadUrl: 'manifest',
  formVersion: '123',
  getPayload: getFetchOptions,
  isJsonValidator: true,
  LoadingComponent: <div></div>,
  uploadTypeUrl: 'manifest-file',
  customAlert: jest.fn(),
  accessToken: 'hunter2',
};

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.createObjectURL = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.revokeObjectURL = jest.fn();

describe('components/manifestFiles', () => {
  afterAll(() => {
    _.debounce = actualDebounce;
  });

  afterEach(() => {
    store.dispatch(removeManifestFiles());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(<ManifestFilesList {...props} />);
  });

  it('renders without crashing when connected to store', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot('isJsonValidator true');
    expect(wrapper.find('SearchBar')).toHaveLength(1);
    expect(wrapper.find('Row Col').at(1).text()).toEqual('Upload New File');
    wrapper.unmount();
  });

  it('download files correctly', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(formConfigCore, 'downloadManifestFile');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(wrapper.find('.tbody .tr')).toHaveLength(fixManifestFiles.length);

    // search
    const search = wrapper.find('SearchBar input');
    search.simulate('input', { target: { value: 'reveal-test' } });
    wrapper.update();
    expect(wrapper.find('.tbody .tr')).toHaveLength(1);

    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(5).find('a');
    expect(downloadFiledCell.text()).toEqual('Download');
    expect(toJson(downloadFiledCell)).toMatchSnapshot();
    // click download button
    downloadFiledCell.simulate('click');
    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(
      'hunter2',
      'https://test-example.com/rest/',
      'form-download',
      {
        createdAt: 'Jun 19, 2020, 4:23:22 PM',
        form_relation: '',
        id: '53',
        identifier: 'reveal-test-file.json',
        isDraft: false,
        isJsonValidator: false,
        jursdiction: '',
        label: 'test publish',
        module: '',
        version: '1.0.27',
      },
      true,
      getFetchOptions
    );
    expect(fetch.mock.calls[1]).toEqual([
      'https://test-example.com/rest/form-download?form_identifier=reveal-test-file.json&form_version=1.0.27&is_json_validator=true',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    wrapper.unmount();
  });

  it('download with correct params form normal file', async () => {
    const downloadSpy = jest.spyOn(formConfigCore, 'downloadManifestFile');
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.once(JSON.stringify(downloadFile));
    // file not json validator
    const normalFileProps = {
      ...props,
      isJsonValidator: false,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...normalFileProps} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot('isJsonValidator false');
    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(6).find('a');
    expect(downloadFiledCell.text()).toEqual('Download');
    // click download button
    downloadFiledCell.simulate('click');
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(downloadSpy).toHaveBeenCalledWith(
      'hunter2',
      'https://test-example.com/rest/',
      'form-download',
      {
        createdAt: 'Jun 19, 2020, 4:23:22 PM',
        form_relation: '',
        id: '53',
        identifier: 'reveal-test-file.json',
        isDraft: false,
        isJsonValidator: false,
        jursdiction: '',
        label: 'test publish',
        module: '',
        version: '1.0.27',
      },
      false,
      getFetchOptions
    );
    expect(fetch.mock.calls[1]).toEqual([
      'https://test-example.com/rest/form-download?form_identifier=reveal-test-file.json&form_version=1.0.27',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    wrapper.unmount();
  });

  it('handles failure if fetching mainfest files fails', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(props.customAlert).toHaveBeenCalledWith(lang.ERROR_OCCURRED, { type: 'error' });
    expect(wrapper.find('.tbody .tr')).toHaveLength(0);

    wrapper.unmount();
  });

  it('handles download file failure', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.mockRejectOnce(new Error('Cannot fetch file'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('.tbody .tr')).toHaveLength(fixManifestFiles.length);

    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(5).find('a');
    downloadFiledCell.simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    expect(props.customAlert).toHaveBeenCalledWith('Error: Cannot fetch file', { type: 'error' });
    wrapper.unmount();
  });
});
