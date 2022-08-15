/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { TableActions } from '..';
import { shallow, mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import { draftFile1, downloadFile } from '../../../../helpers/fixtures';
import * as helpers from '@opensrp/form-config-core';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/form-config-core', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/form-config-core')),
}));

describe('components/Antd/DraftFilelist/TableActions', () => {
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
    file: draftFile1,
    accessToken: 'hunter2',
    opensrpBaseURL: 'https://test-example.com/rest/',
    isJsonValidator: true,
  };

  it('renders without crashing', () => {
    shallow(<TableActions {...props} />);
  });

  it('renders correctly', () => {
    const wrapper = mount(<TableActions {...props} />);

    expect(wrapper.find('Button').props()).toMatchSnapshot();

    wrapper.unmount();
  });

  it('download link works', async () => {
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'downloadManifestFile');

    const wrapper = mount(<TableActions {...props} />);

    wrapper.find('button').simulate('click');

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
        isDraft: true,
        isJsonValidator: false,
        jursdiction: '',
        label: 'test form',
        module: '',
        version: '1.0.26',
      },
      true,
      undefined
    );
    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${draftFile1.identifier}&form_version=${draftFile1.version}&is_json_validator=true`,
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

  it('downloads for non json validators', async () => {
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'downloadManifestFile');

    const nonJsonValidatorProps = {
      ...props,
      isJsonValidator: false,
    };

    const wrapper = mount(<TableActions {...nonJsonValidatorProps} />);

    wrapper.find('button').simulate('click');

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
        isDraft: true,
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
      `https://test-example.com/rest/clientForm?form_identifier=${draftFile1.identifier}&form_version=${draftFile1.version}`,
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
