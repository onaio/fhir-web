import React from 'react';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import { FileList } from '../index';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import reducerRegistry from '@onaio/redux-reducer-registry';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import filesReducer, {
  filesReducerName,
  removeManifestFiles,
} from '../../../../ducks/manifestFiles';
import {
  fixManifestFiles,
  downloadFile,
  fixManifestReleases,
  manifestFile1,
  manifestFile2,
  manifestFile3,
} from '../../../../ducks/tests/fixtures';
import * as helpers from '../../../../helpers/fileDownload';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import { ERROR_OCCURRED } from '../../../../lang';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

const history = createBrowserHistory();
const mockHistoryPush = jest.fn();
history.push = mockHistoryPush;

describe('components/Antd/FileList', () => {
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
    store.dispatch(removeManifestFiles());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const props = {
    opensrpBaseURL: 'https://test-example.com/rest',
    uploadFileURL: '/form-upload',
    isJsonValidator: true,
    history,
    location: {
      hash: '',
      pathname: `/json-validators`,
      search: '',
      state: {},
    },
    match: {
      isExact: true,
      params: { formVersion: null },
      path: '/json-validators',
      url: `/json-validators`,
    },
  };

  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm/metadata?is_json_validator=true`,
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

  it('renders correctly for view file', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.once(JSON.stringify(downloadFile));

    const viewFilesProps = {
      ...props,
      uploadFileURL: '',
      isJsonValidator: false,
      history,
      location: {
        hash: '',
        pathname: `/releases/${fixManifestReleases[0].identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { formVersion: fixManifestReleases[0].identifier },
        path: '/releases:formVersion',
        url: `/releases/${fixManifestReleases[0].identifier}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...viewFilesProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm/metadata?identifier=${fixManifestReleases[0].identifier}`,
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
    fetch.once(JSON.stringify([manifestFile1, manifestFile2, manifestFile3]));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    const search = wrapper.find('input#search');
    // Before search
    expect(wrapper.find('tbody').find('tr')).toHaveLength(3);

    // Search by label
    search.simulate('change', { target: { value: 'test publish' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);

    // Reset
    search.simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(3);

    // Search by identifier
    search.simulate('change', { target: { value: 'test-form' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);

    // Reset
    search.simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(3);

    // Search by module
    search.simulate('change', { target: { value: 'baz' } });
    wrapper.update();
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);

    wrapper.unmount();
  });

  it('download files correctly', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const downloadCell = wrapper.find('tbody').find('tr').at(0).find('td').at(4);
    const dropdown = downloadCell.find('Dropdown');
    const submenu = shallow(<div>{dropdown.prop('overlay')}</div>);

    expect(submenu.find('Button').text()).toEqual('Download');

    // click download button
    submenu.find('Button').simulate('click');
    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(
      JSON.stringify(fixManifestFiles[0]),
      fixManifestFiles[0].identifier
    );
    expect(fetch.mock.calls[1]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${fixManifestFiles[0].identifier}&form_version=${fixManifestFiles[0].version}&is_json_validator=true`,
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
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');
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
          <FileList {...normalFileProps} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const downloadCell = wrapper.find('tbody').find('tr').at(0).find('td').at(5);
    const dropdown = downloadCell.find('Dropdown');
    const submenu = shallow(<div>{dropdown.prop('overlay')}</div>);

    expect(submenu.find('Button').text()).toEqual('Download');

    // click download button
    submenu.find('Button').simulate('click');
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(downloadSpy).toHaveBeenCalledWith(
      JSON.stringify(fixManifestFiles[0]),
      fixManifestFiles[0].identifier
    );
    expect(fetch.mock.calls[1]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${fixManifestFiles[0].identifier}&form_version=${fixManifestFiles[0].version}`,
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
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith(ERROR_OCCURRED);
    expect(wrapper.find('tbody').find('tr').find('td').find('div.ant-empty-image')).toHaveLength(1);

    wrapper.unmount();
  });

  it('handles download file failure', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));
    fetch.mockRejectOnce(() => Promise.reject('Cannot fetch file'));
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('tbody').find('tr')).toHaveLength(fixManifestFiles.length);

    const downloadFiledCell = wrapper.find('tbody').find('tr').at(0).find('td').at(4);
    const dropdown = downloadFiledCell.find('Dropdown');
    const submenu = shallow(<div>{dropdown.prop('overlay')}</div>);

    submenu.find('Button').simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    expect(mockNotificationError).toHaveBeenCalledWith(ERROR_OCCURRED);
    expect(downloadSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('upload file button works', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <FileList {...props} />
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
