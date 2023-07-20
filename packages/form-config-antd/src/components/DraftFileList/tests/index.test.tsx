/* eslint-disable @typescript-eslint/naming-convention */
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
import {
  draftReducer,
  draftReducerName,
  getAllManifestDraftFilesArray,
  removeManifestDraftFiles,
} from '@opensrp/form-config-core';
import * as helpers from '@opensrp/form-config-core';
import * as notifications from '@opensrp/notifications';
import { DrafFileList } from '..';
import {
  FixManifestDraftFiles,
  downloadFile,
  draftFile1,
  draftFile2,
  draftFile3,
} from '../../../helpers/fixtures';
import toJson from 'enzyme-to-json';

const mockHistoryPush = jest.fn();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('@opensrp/form-config-core', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/form-config-core')),
}));

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

reducerRegistry.register(draftReducerName, draftReducer);

const history = createBrowserHistory();
history.push = mockHistoryPush;

const props = {
  opensrpBaseURL: 'https://test-example.com/rest/',
  uploadFileURL: '/form-upload',
  history,
  location: {
    hash: '',
    pathname: `/drafts`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: '/drafts',
    url: `/drafts`,
  },
  onMakeReleaseRedirectURL: '/releases',
};

describe('components/Antd/DraftFileList', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    store.dispatch(removeManifestDraftFiles());
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
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
      `https://test-example.com/rest/clientForm/metadata?is_draft=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    const content = wrapper.find('div.content-section');
    expect(wrapper.find('PageHeader').text()).toMatchInlineSnapshot(`"Draft Files"`);
    expect(content.find('input#search')).toBeTruthy();
    expect(content.find('button#uploadNewFile').text()).toMatchInlineSnapshot(`"Upload New File"`);
    expect(content.find('TableLayout#FormDraftFileList')).toBeTruthy();
    expect(content.find('button#makeRelease').text()).toMatchInlineSnapshot(`"Make Release"`);
    wrapper.unmount();
  });

  it('searches correctly', async () => {
    fetch.once(JSON.stringify([draftFile1, draftFile2, draftFile3]));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
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
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'downloadManifestFile');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const downloadButton = wrapper.find('tbody').find('tr').at(0).find('td').at(5).find('button');
    expect(downloadButton.text()).toEqual('Download');
    // click download button
    downloadButton.simulate('click');
    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(
      'hunter2',
      'https://test-example.com/rest/',
      'clientForm',
      {
        createdAt: 'Jun 19, 2020, 4:23:22 PM',
        form_relation: '',
        id: '53',
        identifier: 'reveal-test-file.json',
        isDraft: false,
        isJsonValidator: false,
        jursdiction: '',
        key: 0,
        label: 'test publish',
        module: '',
        version: '1.0.27',
      },
      false,
      undefined
    );
    expect(fetch.mock.calls[1]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${FixManifestDraftFiles[1].identifier}&form_version=${FixManifestDraftFiles[1].version}`,
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

  it('makes a release correctly', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('Space').at(2).find('button').simulate('click');

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

    expect(fetch.mock.calls[1]).toEqual(['https://test-example.com/rest/manifest', postData]);

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // should clear drafts in store on publish
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual([]);

    wrapper.unmount();
  });

  it('handles failure if fetching draft files fails', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith('API is down');
    expect(wrapper.find('tbody').find('tr').find('td').find('div.ant-empty-image')).toHaveLength(1);

    wrapper.unmount();
  });

  it('handles download file failure', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.mockRejectOnce(new Error('Cannot fetch file'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('tbody').find('tr')).toHaveLength(FixManifestDraftFiles.length);

    const downloadFiledCell = wrapper
      .find('tbody')
      .find('tr')
      .at(0)
      .find('td')
      .at(5)
      .find('button');
    downloadFiledCell.simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem downloading this file');
    wrapper.unmount();
  });

  it('handles failure if creating manifest file fails', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));
    fetch.mockRejectOnce(new Error('Cannot create file'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('Space').at(2).find('button').simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem when making release');
  });

  it('renders correctly if manifest fetch is empty', async () => {
    fetch.once(JSON.stringify([]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('tbody').find('tr').find('td').find('div.ant-empty-image')).toHaveLength(1);
    expect(toJson(wrapper.find('Space').at(2))).toBeFalsy();

    wrapper.unmount();
  });

  it('upload file button works', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
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

  it('sorts by file name', async () => {
    fetch.once(JSON.stringify([draftFile1, draftFile2, draftFile3]));
    fetch.once(JSON.stringify(downloadFile));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <DrafFileList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    const heading = wrapper.find('thead');

    // Ascending
    heading.find('th').at(1).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(1).text()).toEqual('foo');
    // Descending
    heading.find('th').at(1).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(1).text()).toEqual('test publish');
  });
});
