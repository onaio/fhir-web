import { shallow } from 'enzyme';
import React from 'react';
import { ErrorBoundaryFallback } from '..';
import lang from '../lang';

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
    expect(wrapper.find('Result').prop('title')).toBe(lang.PAGE_TITLE);
    expect(wrapper.find('Result').prop('subTitle')).toBe(lang.PAGE_SUB_TITLE);
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
