import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { ManifestDraftFiles, ConnectedManifestDraftFiles } from '../index';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import draftReducer, {
  fetchManifestDraftFiles,
  draftReducerName,
  getAllManifestDraftFilesArray,
} from '../../../ducks/manifestDraftFiles';
import { FixManifestDraftFiles, downloadFile } from '../../../ducks/tests/fixtures';
import toJson from 'enzyme-to-json';
import * as helpers from '../../../helpers/fileDownload';
import _ from 'lodash';
import { act } from 'react-dom/test-utils';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fetch = require('jest-fetch-mock');

/** register the reducers */
reducerRegistry.register(draftReducerName, draftReducer);

const history = createBrowserHistory();

const baseURL = 'https://test-example.com/rest/';
const endpoint = 'metadata';
const props = {
  baseURL,
  endpoint,
  downloadEndPoint: 'formDownload',
  formUploadUrl: '/manifest',
  getPayload: getFetchOptions,
  LoadingComponent: <div>Loading</div>,
  manifestEndPoint: 'manifest',
  releasesUrl: '/manifest/releases',
  uploadTypeUrl: 'file-upload',
};

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.createObjectURL = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.revokeObjectURL = jest.fn();

describe('components/ManifestReleases', () => {
  afterAll(() => {
    _.debounce = actualDebounce;
  });

  it('renders without crashing', () => {
    shallow(<ManifestDraftFiles {...props} />);
  });

  it('renders without crashing when connected to store', async () => {
    downloadFile.clientForm.json = JSON.stringify(downloadFile.clientForm.json);
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');
    store.dispatch(fetchManifestDraftFiles(FixManifestDraftFiles));
    const mockList = jest.fn();
    OpenSRPService.prototype.list = mockList;
    mockList
      .mockReturnValueOnce(Promise.resolve(FixManifestDraftFiles))
      .mockReturnValueOnce(Promise.resolve(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestDraftFiles {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.update();
    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot();
    expect(wrapper.find('SearchBar')).toHaveLength(1);

    expect(wrapper.find('.tbody .tr')).toHaveLength(2);
    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(5).find('a');
    expect(downloadFiledCell.text()).toEqual('Download');
    expect(toJson(downloadFiledCell)).toMatchSnapshot();

    downloadFiledCell.simulate('click');
    await flushPromises();
    expect(downloadSpy).toHaveBeenCalledWith(downloadFile.clientForm.json, 'reveal-test-file.json');
    expect(mockList.mock.calls[1][0]).toEqual({
      /* eslint-disable @typescript-eslint/camelcase */
      form_identifier: 'reveal-test-file.json',
      form_version: '1.0.27',
    });

    // search
    const search = wrapper.find('SearchBar input');
    search.simulate('input', { target: { value: 'test form' } });
    wrapper.update();
    expect(wrapper.find('.tbody .tr')).toHaveLength(1);

    // test creating manifest file
    wrapper.find('Button').simulate('click');
    await flushPromises();
    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body:
        '{"json":"{\\"forms_version\\":\\"1.0.27\\",\\"identifiers\\":[\\"reveal-test-file.json\\",\\"test-form-1.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };
    expect(fetch).toHaveBeenCalledWith('https://test-example.com/rest/manifest', postData);

    // upload file button test
    const uploadBtn = wrapper.find('Col Link');
    expect(uploadBtn.text()).toEqual('Upload New File');
    uploadBtn.simulate('click');
    await flushPromises();
    // should clear drafts in store on publish
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual([]);
  });
});
