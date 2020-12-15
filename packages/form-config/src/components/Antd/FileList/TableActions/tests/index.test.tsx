import React from 'react';
import { TableActions } from '..';
import { shallow, mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import { manifestFile1, downloadFile } from '../../../../../ducks/tests/fixtures';
import * as helpers from '../../../../../helpers/fileDownload';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { BrowserRouter } from 'react-router-dom';

describe('components/Antd/FileList/TableActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const props = {
    file: manifestFile1,
    accessToken: 'hunter2',
    opensrpBaseURL: 'https://test-example.com/rest',
    uploadFileURL: '/upload',
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
    const downloadSpy = jest.spyOn(helpers, 'handleDownload');

    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );

    const dropdown = wrapper.find('Dropdown');
    const submenu = shallow(<div>{dropdown.prop('overlay')}</div>);

    submenu.find('Button').simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(downloadSpy).toHaveBeenCalledWith(
      downloadFile.clientForm.json,
      manifestFile1.identifier
    );
    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm?form_identifier=${manifestFile1.identifier}&form_version=${manifestFile1.version}`,
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
