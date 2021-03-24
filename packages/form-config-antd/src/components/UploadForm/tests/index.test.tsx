import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { UploadForm } from '..';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { filesReducer, fetchManifestFiles, filesReducerName } from '@opensrp/form-config-core';
import { fixManifestFiles } from '../../../helpers/fixtures';
import sampleFile from './sampleFile.json';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/server-service';
import lang from '../../../lang';

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

const history = createBrowserHistory();

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('@opensrp/server-service', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/server-service')),
}));

const props = {
  opensrpBaseURL: 'https://test-example.com/rest',
  isJsonValidator: false,
  onSaveRedirectURL: '/foo',
  history,
  location: {
    hash: '',
    pathname: `/upload-form`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { formId: null },
    path: '/upload-form',
    url: `/upload-form`,
  },
};

describe('components/UploadForm', () => {
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
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );

    const content = wrapper.find('div.layout-content');
    expect(content.find('Title').props()).toMatchSnapshot('title');
    expect(content.find('Card').props()).toMatchSnapshot('card');
    wrapper.unmount();
  });

  it('validates required fields', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(0).prop('errors')).toEqual(['Form Name is required']);
    expect(wrapper.find('FormItemInput').at(1).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(2).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual(['Form is required']);

    wrapper.unmount();
  });

  it('uploads form', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );

    wrapper
      .find('input#form_name')
      .simulate('change', { target: { name: 'form_name', value: 'test name' } });
    wrapper
      .find('input#module')
      .simulate('change', { target: { name: 'module', value: 'test module' } });
    wrapper
      .find('input#form_relation')
      .simulate('change', { target: { name: 'form_relation', value: 'bar' } });
    wrapper.find('input#form').simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
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
          <UploadForm {...isJsonValidatorProps} />
        </Router>
      </Provider>
    );

    wrapper
      .find('input#form_name')
      .simulate('change', { target: { name: 'form_name', value: 'test name' } });
    wrapper
      .find('input#module')
      .simulate('change', { target: { name: 'module', value: 'test module' } });
    wrapper
      .find('input#form_relation')
      .simulate('change', { target: { name: 'form_relation', value: 'bar' } });
    wrapper.find('input#form').simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    wrapper.unmount();
  });

  it('edits form correctly', async () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles));

    const editProps = {
      ...props,
      location: {
        hash: '',
        pathname: `/upload-form/53`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { formId: '53' },
        path: '/upload-form:formId',
        url: `/upload-form/53`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...editProps} />
        </Router>
      </Provider>
    );

    const content = wrapper.find('div.layout-content');
    expect(content.find('Title').props()).toMatchSnapshot('title');
    expect(content.find('Card').props()).toMatchSnapshot('card');

    expect(wrapper.find('input').at(0).props().value).toEqual('test publish');

    wrapper
      .find('input')
      .at(3)
      .simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    wrapper.unmount();
  });

  it('handles error if upload fails', async () => {
    fetch.mockResponse('API has been hijacked by aliens', { status: 500 });

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );

    wrapper
      .find('input#form_name')
      .simulate('change', { target: { name: 'form_name', value: 'test name' } });
    wrapper
      .find('input#module')
      .simulate('change', { target: { name: 'module', value: 'test module' } });
    wrapper
      .find('input#form_relation')
      .simulate('change', { target: { name: 'form_relation', value: 'bar' } });
    wrapper.find('input#form').simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith('API has been hijacked by aliens');
    wrapper.unmount();
  });

  it('removes selected file', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );
    wrapper
      .find('input')
      .at(3)
      .simulate('change', { target: { name: 'form', files: sampleFile } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual([]);

    // We can remove the selected file
    wrapper.find('button').at(1).simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual(['Form is required']);

    wrapper.unmount();
  });

  it('handles non-API errors when submitting', async () => {
    jest
      .spyOn(OpenSRPService, 'processAcessToken')
      .mockImplementationOnce(() => Promise.reject('Error'));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UploadForm {...props} />
        </Router>
      </Provider>
    );

    wrapper
      .find('input#form_name')
      .simulate('change', { target: { name: 'form_name', value: 'test name' } });
    wrapper
      .find('input#module')
      .simulate('change', { target: { name: 'module', value: 'test module' } });
    wrapper
      .find('input#form_relation')
      .simulate('change', { target: { name: 'form_relation', value: 'bar' } });
    wrapper.find('input#form').simulate('change', { target: { name: 'form', files: sampleFile } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch).not.toHaveBeenCalled();
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
    wrapper.unmount();
  });
});
