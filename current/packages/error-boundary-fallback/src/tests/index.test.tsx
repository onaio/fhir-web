import { shallow } from 'enzyme';
import React from 'react';
import { ErrorBoundaryFallback } from '..';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('/components/Fallback', () => {
  it('renders without crasshing', () => {
    shallow(<ErrorBoundaryFallback />);
  });

  it('render correctly', () => {
    const wrapper = shallow(<ErrorBoundaryFallback />);
    expect(wrapper.find('Result')).toHaveLength(1);
    expect(wrapper.find('Result').prop('status')).toBe('error');
    expect(wrapper.find('Result').prop('title')).toBe('An Error Occurred');
    expect(wrapper.find('Result').prop('subTitle')).toBe(
      'There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'
    );
  });

  it('correctly redirects to home', () => {
    const wrapper = shallow(<ErrorBoundaryFallback homeUrl="/" />);
    wrapper.find('Result').props().extra.props.onClick();
    expect(window.location.href).toEqual('/');
  });

  it('correctly redirects if homeUrl not passed', () => {
    const wrapper = shallow(<ErrorBoundaryFallback />);
    wrapper.find('Result').props().extra.props.onClick();
    expect(window.location.href).toEqual('/');
  });
});
