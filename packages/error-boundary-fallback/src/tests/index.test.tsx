import { shallow } from 'enzyme';
import React from 'react';
import * as Sentry from '@sentry/react';
import { ErrorBoundary } from '..';

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
    wrapper.simulateError(new Error());
    expect(wrapper.find('Result')).toHaveLength(1);
    expect(wrapper.find('Result').prop('status')).toBe('error');
    expect(wrapper.find('Result').prop('title')).toBe('An Error Occurred');
    expect(wrapper.find('Result').prop('subTitle')).toBe(
      'There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'
    );
  });

  it('correctly redirects to home', () => {
    const wrapper = shallow(<ErrorBoundary />);
    wrapper.simulateError(new Error());
    expect(window.location.href).toEqual('http://localhost/');
    wrapper.find('Result').props().extra.props.onClick();
    expect(window.location.href).toEqual('/');
  });

  it('should intialize Sentry when dsn is provided', () => {
    Sentry.init = jest.fn();
    const dsn = 'testUrl';
    shallow(<ErrorBoundary dsn={dsn} />);
    expect(Sentry.init).toHaveBeenCalledWith({ dsn: dsn });
  });

  it('should not intialize Sentry when dsn is not provided', () => {
    Sentry.init = jest.fn();
    shallow(<ErrorBoundary />);
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
