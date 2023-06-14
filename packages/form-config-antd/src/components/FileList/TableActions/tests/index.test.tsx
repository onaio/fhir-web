/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { TableActions } from '..';
import { shallow, mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import { manifestFile1, downloadFile } from '../../../../helpers/fixtures';
import * as helpers from '@opensrp/form-config-core';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/form-config-core', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/form-config-core')),
}));

describe('components/Antd/FileList/TableActions', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const props = {
    file: manifestFile1,
    accessToken: 'hunter2',
    opensrpBaseURL: 'https://test-example.com/rest/',
    uploadFileURL: 'upload',
    isJsonValidator: false,
  };

  it('renders without crashing', () => {
    shallow(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );

    expect(wrapper.find('Link').props()).toMatchSnapshot('edit');
    expect(wrapper.find('Divider').props()).toMatchSnapshot('divider');
    expect(wrapper.find('Dropdown').props()).toMatchSnapshot('dots menu');

    wrapper.unmount();
  });

  it('download link works', async () => {
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'downloadManifestFile');

    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );

    const dropdown = wrapper.find('Dropdown');
    const submenu = shallow(<div>{dropdown.prop('menu')}</div>);

    submenu.find('Button').simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(
      'hunter2',
      'https://test-example.com/rest/',
      'clientForm',
      {
        createdAt: 'Jun 19, 2020, 12:31:37 PM',
        form_relation: '',
        id: '52',
        identifier: 'test-form-1.json',
        isDraft: false,
        isJsonValidator: false,
        jursdiction: '',
        label: 'test form',
        module: '',
        version: '1.0.26',
      },
      false,
      undefined
    );
    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${manifestFile1.identifier}&form_version=${manifestFile1.version}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    wrapper.unmount();
  });
});
