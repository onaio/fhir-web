/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { ManifestDraftFiles, ConnectedManifestDraftFiles } from '../index';
import { getFetchOptions } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import reducerRegistry from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import { FixManifestDraftFiles, downloadFile } from '../../../helpers/fixtures';
import toJson from 'enzyme-to-json';
import * as formConfigCore from '@opensrp/form-config-core';
import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import fetch from 'jest-fetch-mock';
import lang from '../../../lang';

const { draftReducer, draftReducerName, getAllManifestDraftFilesArray, removeManifestDraftFiles } =
  formConfigCore;

jest.mock('@opensrp/form-config-core', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/form-config-core')),
}));

/** register the reducers */
reducerRegistry.register(draftReducerName, draftReducer);

const history = createBrowserHistory();

const baseURL = 'https://test-example.com/rest/';
const endpoint = 'metadata';
const props = {
  baseURL,
  endpoint,
  downloadEndPoint: 'form-download',
  formUploadUrl: 'manifest',
  getPayload: getFetchOptions,
  LoadingComponent: <div>Loading</div>,
  manifestEndPoint: 'manifest',
  releasesUrl: 'manifest/releases',
  uploadTypeUrl: 'file-upload',
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

describe('components/DraftFiles', () => {
  afterAll(() => {
    _.debounce = actualDebounce;
  });

  afterEach(() => {
    store.dispatch(removeManifestDraftFiles());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(<ManifestDraftFiles {...props} />);
  });

  it('renders without crashing when connected to store', async () => {
    const downloadSpy = jest.spyOn(formConfigCore, 'downloadManifestFile');
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
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
    expect(wrapper.find('SearchBar')).toHaveLength(1);

    expect(wrapper.find('.tbody .tr')).toHaveLength(2);
    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(5).find('a');
    expect(downloadFiledCell.text()).toEqual('Download');
    expect(toJson(downloadFiledCell)).toMatchSnapshot();

    // Upload link
    expect(toJson(wrapper.find('Link'))).toMatchSnapshot('upload link');

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

    // search
    const search = wrapper.find('SearchBar input');
    search.simulate('input', { target: { value: 'test form' } });
    wrapper.update();
    expect(wrapper.find('.tbody .tr')).toHaveLength(1);

    // test creating manifest file
    expect(wrapper.find('Button').text()).toEqual('Make Release');
    wrapper.find('Button').simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: '{"json":"{\\"forms_version\\":\\"1.0.27\\",\\"identifiers\\":[\\"reveal-test-file.json\\",\\"test-form-1.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };

    expect(fetch.mock.calls[2]).toEqual(['https://test-example.com/rest/manifest', postData]);

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // should clear drafts in store on publish
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual([]);
  });

  it('handles failure if fetching draft files fails', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
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
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.mockRejectOnce(new Error('Cannot fetch file'));
    const downloadSpy = jest.spyOn(formConfigCore, 'handleDownload');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('.tbody .tr')).toHaveLength(FixManifestDraftFiles.length);

    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(5).find('a');
    downloadFiledCell.simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    expect(props.customAlert).toHaveBeenCalledWith('Error: Cannot fetch file', { type: 'error' });
    expect(downloadSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('handles failure if creating manifest file fails', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.mockRejectOnce(new Error('Cannot create file'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    wrapper.find('Button').simulate('click');
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(props.customAlert).toHaveBeenCalledWith(lang.ERROR_OCCURRED, { type: 'error' });
  });

  it('renders correctly if manifest fetch is empty', async () => {
    fetch.once(JSON.stringify([]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('Button')).toHaveLength(0);
  });
});
