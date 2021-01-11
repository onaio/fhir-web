import { shallow } from 'enzyme';
import React from 'react';
import { ErrorBoundary } from '..';
import { PAGE_SUB_TITLE, PAGE_TITLE } from '../lang';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('/components/Fallback', () => {
  it('renders without crasshing', () => {
    shallow(<ErrorBoundary />);
  });

  it('render correctly', () => {
    const wrapper = shallow(<ErrorBoundary />);
    expect(wrapper.find('Result')).toHaveLength(1);
    expect(wrapper.find('Result').prop('status')).toBe('error');
    expect(wrapper.find('Result').prop('title')).toBe(PAGE_TITLE);
    expect(wrapper.find('Result').prop('subTitle')).toBe(PAGE_SUB_TITLE);
  });

  it('correctly redirects to home', () => {
    const wrapper = shallow(<ErrorBoundary homeUrl="/" />);
    wrapper.find('Result').props().extra.props.onClick();
    expect(window.location.href).toEqual('/');
  });

  it('correctly redirects if homeUrl not passed', () => {
    const wrapper = shallow(<ErrorBoundary />);
    wrapper.find('Result').props().extra.props.onClick();
    expect(window.location.href).toEqual('/');
  });
});
