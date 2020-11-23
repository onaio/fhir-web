import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { ManifestFilesList, ConnectedManifestFilesList } from '../index';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import filesReducer, { fetchManifestFiles, filesReducerName } from '../../../ducks/manifestFiles';
import { fixManifestFiles, downloadFile } from '../../../ducks/tests/fixtures';
import toJson from 'enzyme-to-json';
import * as helpers from '../../../helpers/fileDownload';
import _ from 'lodash';

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

const history = createBrowserHistory();

const baseURL = 'https://test-example.com/rest';
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

  it('renders without crashing', () => {
    shallow(<ManifestFilesList {...props} />);
  });

  it('renders without crashing when connected to store', async () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles));
    const mockList = jest.fn();
    OpenSRPService.prototype.list = mockList;
    mockList.mockReturnValueOnce(Promise.resolve(fixManifestFiles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await flushPromises();
    wrapper.update();
    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot('isJsonValidator true');
    expect(wrapper.find('SearchBar')).toHaveLength(1);
    expect(wrapper.find('Row Col').at(1).text()).toEqual('Upload New File');
  });

  it('download files correctly', async () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles));
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');
    const mockList = jest.fn();
    OpenSRPService.prototype.list = mockList;
    mockList
      .mockReturnValueOnce(Promise.resolve(fixManifestFiles))
      .mockReturnValueOnce(Promise.resolve(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );

    await flushPromises();
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
    await flushPromises();
    expect(downloadSpy).toHaveBeenCalledWith(downloadFile.clientForm.json, 'reveal-test-file.json');
    // when isJsonValidator download to be called with is_json_validator param
    expect(mockList.mock.calls[1][0]).toEqual({
      /* eslint-disable @typescript-eslint/camelcase */
      form_identifier: 'reveal-test-file.json',
      form_version: '1.0.27',
      is_json_validator: true,
    });
  });

  it('download with correct params form normal file', async () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles));
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');
    const mockList = jest.fn();
    OpenSRPService.prototype.list = mockList;
    mockList
      .mockReturnValueOnce(Promise.resolve(fixManifestFiles))
      .mockReturnValueOnce(Promise.resolve(downloadFile));

    // file not json validator
    props.isJsonValidator = false;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedManifestFilesList {...props} />
        </Router>
      </Provider>
    );
    await flushPromises();
    wrapper.update();

    expect(wrapper.find('DrillDownTable').props()).toMatchSnapshot('isJsonValidator false');
    const downloadFiledCell = wrapper.find('.tbody .tr').at(0).find('.td').at(6).find('a');
    expect(downloadFiledCell.text()).toEqual('Download');
    // click download button
    downloadFiledCell.simulate('click');
    await flushPromises();
    expect(downloadSpy).toHaveBeenCalledWith(downloadFile.clientForm.json, 'reveal-test-file.json');
    // when not json validator is_json_validator param is absent
    expect(mockList.mock.calls[1][0]).toEqual({
      /* eslint-disable @typescript-eslint/camelcase */
      form_identifier: 'reveal-test-file.json',
      form_version: '1.0.27',
    });
  });
});
