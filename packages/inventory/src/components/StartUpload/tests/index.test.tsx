import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { StartUpload } from '..';
import flushPromises from 'flush-promises';

describe('upload start page', () => {
  it('renders and works correctly', async () => {
    const fileUploadMock = jest.fn();

    const props = {
      onFileUpload: fileUploadMock,
    };
    const wrapper = mount(<StartUpload {...props} />);

    // full card snapshot
    expect(wrapper.text()).toMatchSnapshot('full card snapshot');

    // simulate file upload
    const file = new File([''], 'file.csv');
    await act(async () => {
      wrapper.find('input[type="file"]').simulate('change', { target: { files: [file] } });
      wrapper.update();
    });

    await flushPromises();

    expect(fileUploadMock).toHaveBeenCalledWith(file);

    wrapper.update();
  });

  it('renders without crashing', async () => {
    // execute default prop unctions
    const props = {};
    const wrapper = mount(<StartUpload {...props} />);

    // simulate file upload
    await act(async () => {
      wrapper.find('input[type="file"]').simulate('change', { target: { files: [] } });
      wrapper.update();
    });

    await flushPromises();

    wrapper.update();
  });

  it('default props work correctly', async () => {
    // execute default prop unctions
    const props = {};
    const wrapper = mount(<StartUpload {...props} />);

    // simulate file upload
    const file = new File([''], 'file.csv');
    await act(async () => {
      wrapper.find('input[type="file"]').simulate('change', { target: { files: [file] } });
      wrapper.update();
    });

    await flushPromises();

    wrapper.update();
  });
});
