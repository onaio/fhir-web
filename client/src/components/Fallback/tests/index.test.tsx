import { mount, shallow } from 'enzyme';
import React from 'react';
import Fallback from '..';
const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('/components/Fallback', () => {
  it('renders without crasshing', () => {
    shallow(<Fallback />);
  });

  it('render correctly', () => {
    const wrapper = shallow(<Fallback />);
    expect(wrapper.find('Result')).toHaveLength(1);
    expect(wrapper.find('Result').prop('status')).toBe('error');
    expect(wrapper.find('Result').prop('title')).toBe('An Error Occurred');
    expect(wrapper.find('Result').prop('subTitle')).toBe(
      'There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'
    );
  });

  it('correctly redirects to home', () => {
    const wrapper = mount(<Fallback />);
    expect(wrapper.find('button')).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });
});
