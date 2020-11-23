import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { UploadConfigFile, ConnectedUploadConfigFile } from '../index';
import { getFetchOptions } from '@opensrp/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import filesReducer, { fetchManifestFiles, filesReducerName } from '../../../ducks/manifestFiles';
import { fixManifestFiles } from '../../../ducks/tests/fixtures';
import sampleFile from './sampleFile.json';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fetch = require('jest-fetch-mock');

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

const history = createBrowserHistory();

const props = {
  baseURL: 'https://test-example.com/rest/',
  draftFilesUrl: '/drafts',
  endpoint: 'forms/upload',
  formId: null,
  isJsonValidator: false,
  getPayload: getFetchOptions,
  LoadingComponent: <div>Loading</div>,
  validatorsUrl: '/validators',
};

describe('components/UploadFile', () => {
  it('renders without crashing', () => {
    shallow(<UploadConfigFile {...props} />);
  });

  it('uploads form correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUploadConfigFile {...props} />
        </Router>
      </Provider>
    );
    expect(wrapper.find('input[name="form_name"]')).toBeTruthy();
    expect(wrapper.find('input[name="module"]')).toBeTruthy();
    expect(wrapper.find('input[name="form_relation"]')).toBeTruthy();
    expect(wrapper.find('input[name="form"]')).toBeTruthy();

    expect(wrapper.find('Button').text()).toEqual('Upload file');
    wrapper.find('Button').simulate('submit');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await new Promise<any>((resolve) => setImmediate(resolve));
    wrapper.update();
    // we have errors
    expect(wrapper.find('.text-danger').at(0).text()).toEqual('Form name is required');
    expect(wrapper.find('.text-danger').at(1).text()).toEqual('Form is required');

    wrapper
      .find('input[name="form_name"]')
      .simulate('change', { target: { name: 'form_name', value: 'test name' } });
    wrapper
      .find('input[name="module"]')
      .simulate('change', { target: { name: 'module', value: 'test module' } });
    wrapper
      .find('input[name="form"]')
      .simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('Button').simulate('submit');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await new Promise<any>((resolve) => setImmediate(resolve));
    await flushPromises();
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/forms/upload',
      expect.any(Object)
    );
  });

  it('edits form correctly', async () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles));
    const editProps = {
      ...props,
      formId: '53',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUploadConfigFile {...editProps} />
        </Router>
      </Provider>
    );
    // four form groups
    expect(wrapper.find('FormGroup')).toHaveLength(4);
    expect(wrapper.find('input').at(0).props().value).toEqual('test publish');
    // 3 of inputs should be disabled
    expect(wrapper.find('input[disabled=true]')).toHaveLength(3);

    wrapper
      .find('input[name="form"]')
      .simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('Button').simulate('submit');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await new Promise<any>((resolve) => setImmediate(resolve));
    await flushPromises();
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/forms/upload',
      expect.any(Object)
    );
  });
});
