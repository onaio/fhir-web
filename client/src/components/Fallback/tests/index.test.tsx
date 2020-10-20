import { mount, shallow } from 'enzyme';
import React from 'react';
import Fallback from '..';
jest.mock('react-router', () => ({
  useHistory: () => ({
    push: jest.fn(),
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
    beforeEach(() => jest.resetModules());
    const mockCallBack = jest.fn();
    const wrapper = mount(<Fallback />);
    expect(wrapper.find('#backHome')).toHaveLength(1);
    wrapper.find('#backHome').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
