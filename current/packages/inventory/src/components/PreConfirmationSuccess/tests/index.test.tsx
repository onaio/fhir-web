import { mount, shallow } from 'enzyme';
import React from 'react';
import { PreConfirmationSuccess } from '..';

describe('pre confirmation success', () => {
  it('renders without crashing', () => {
    shallow(<PreConfirmationSuccess />);
  });

  it('works correctly', () => {
    const cancelMock = jest.fn();
    const commitMock = jest.fn(() => Promise.resolve({}));
    const props = {
      onCancel: cancelMock,
      onCommitInventory: commitMock,
      rowsProcessed: 0,
      filename: 'uploaded.csv',
    };

    const wrapper = mount(<PreConfirmationSuccess {...props} />);

    // full card snapshot
    expect(wrapper.text()).toMatchSnapshot('full card snapshot');

    // simulate onCommit callback
    wrapper.find('button#confirm-commit').simulate('click');

    wrapper.update();

    expect(commitMock).toHaveBeenCalled();

    expect(cancelMock).not.toHaveBeenCalled();

    // simulate cancel

    wrapper.find('button#cancel-commit').simulate('click');

    wrapper.update();

    expect(cancelMock).toHaveBeenCalled();
  });
});
