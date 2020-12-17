import React from 'react';
import { TableActions } from '..';
import { shallow, mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import { draftFile1, downloadFile } from '../../../../../ducks/tests/fixtures';
import * as helpers from '../../../../../helpers/fileDownload';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

describe('components/Antd/DraftFilelist/TableActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const props = {
    file: draftFile1,
    accessToken: 'hunter2',
    opensrpBaseURL: 'https://test-example.com/rest',
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
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');

    const wrapper = mount(<TableActions {...props} />);

    wrapper.find('button').simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(downloadFile.clientForm.json, draftFile1.identifier);
    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${draftFile1.identifier}&form_version=${draftFile1.version}&is_json_validator=true`,
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

  it('downloads for non json validators', async () => {
    fetch.once(JSON.stringify(downloadFile));
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');

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

    expect(downloadSpy).toHaveBeenCalledWith(downloadFile.clientForm.json, draftFile1.identifier);
    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${draftFile1.identifier}&form_version=${draftFile1.version}`,
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
});
