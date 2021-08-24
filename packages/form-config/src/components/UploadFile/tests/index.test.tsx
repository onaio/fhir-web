import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { UploadConfigFile, ConnectedUploadConfigFile } from '../index';
import { getFetchOptions } from '@opensrp-web/server-service';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp-web/store';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { fetchManifestFiles } from '@opensrp-web/form-config-core';
import { fixManifestFiles } from '../../../helpers/fixtures';
import sampleFile from './sampleFile.json';
import { act } from 'react-dom/test-utils';
import { OpenSRPService } from '@opensrp-web/server-service';
import lang from '../../../lang';

const history = createBrowserHistory();

jest.mock('@opensrp-web/server-service', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp-web/server-service')),
}));

const props = {
  baseURL: 'https://test-example.com/rest/',
  draftFilesUrl: '/drafts',
  endpoint: 'forms/upload',
  formId: null,
  isJsonValidator: false,
  getPayload: getFetchOptions,
  LoadingComponent: <div>Loading</div>,
  validatorsUrl: '/validators',
  customAlert: jest.fn(),
  accessToken: 'hunter2',
};

describe('components/UploadFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

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
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    // we have errors
    expect(wrapper.find('.text-danger').at(0).text()).toEqual('Form Name is required');
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
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/forms/upload',
      expect.any(Object)
    );
    wrapper.unmount();
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
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/forms/upload',
      expect.any(Object)
    );
    wrapper.unmount();
  });

  it('handles error if upload fails', async () => {
    fetch.once('API has been hijacked by aliens', { status: 500 });

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUploadConfigFile {...props} />
        </Router>
      </Provider>
    );

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

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(props.customAlert).toHaveBeenCalledWith('API has been hijacked by aliens', {
      type: 'error',
    });
    wrapper.unmount();
  });

  it('uploads file if isJsonValidator is true', async () => {
    const isJsonValidatorProps = {
      ...props,
      isJsonValidator: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUploadConfigFile {...isJsonValidatorProps} />
        </Router>
      </Provider>
    );

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

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/forms/upload',
      expect.any(Object)
    );
    wrapper.unmount();
  });

  it('handles non-API errors when submitting', async () => {
    jest
      .spyOn(OpenSRPService, 'processAcessToken')
      .mockImplementationOnce(() => Promise.reject('Error'));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUploadConfigFile {...props} />
        </Router>
      </Provider>
    );
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
    await act(async () => {
      await flushPromises();
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(props.customAlert).toHaveBeenCalledWith(lang.ERROR_OCCURRED, {
      type: 'error',
    });
    wrapper.unmount();
  });
});
