import { mount, shallow } from 'enzyme';
import React from 'react';
import { UploadValidateCard } from '..';
import { UploadStatus } from '../../../helpers/utils';

describe('upload validation loader card', () => {
  it('renders correctly', () => {
    shallow(<UploadValidateCard />);
  });

  it('works correctly', () => {
    const cancelMock = jest.fn();
    const props = {
      onCancel: cancelMock,
      uploadStatus: UploadStatus.PRE_CONFIRMATION_VALIDATION,
      filename: 'loading.csv',
    };
    const wrapper = mount(<UploadValidateCard {...props} />);

    // full page snapshot
    expect(wrapper.text()).toMatchSnapshot('full card snapshot');

    // cancel mock is invoked
    wrapper.find('button').simulate('click');
    wrapper.update();

    expect(cancelMock).toHaveBeenCalled();
  });
});
