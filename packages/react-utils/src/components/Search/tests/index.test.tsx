import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import _ from 'lodash';
import React from 'react';
// import { Router } from 'react-router';
import { BrowserRouter as Router, Location } from 'react-router-dom';
import { SearchForm } from '../../Search';
import { createChangeHandler } from '../utils';

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

const history = createBrowserHistory();

jest.useFakeTimers();

describe('src/components/SearchForm', () => {
  afterAll(() => {
    _.debounce = actualDebounce;
  });

  it('renders without crashing', () => {
    shallow(<SearchForm />);
  });
  it('renders correctly', () => {
    const props = {
      placeholder: 'Random string',
    };
    const wrapper = mount(<SearchForm {...props} />);
    expect(wrapper.find('.search-input-wrapper')).toHaveLength(1);
    wrapper.unmount();
  });

  it('handles submit correctly when provided changeHandler', () => {
    const onChangeHandlerMock = jest.fn();
    const props = {
      onChangeHandler: onChangeHandlerMock,
      placeholder: '',
    };
    const wrapper = mount(
      <Router>
        <SearchForm {...props} />
      </Router>
    );

    wrapper.find('input').simulate('change', { target: { value: 'test' } });

    expect(onChangeHandlerMock.mock.calls[0][0].target.value).toEqual('test');
    wrapper.unmount();
  });

  it('changeHandler Factory works', () => {
    // this test case exercises the createChangeHandler factory with is reveal-specific
    const queryParam = 'randomString';
    const locationProps = {
      history,
      location: {
        hash: '',
        pathname: '/somewhere',
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: {},
        path: '/somewhere',
        url: '/somehwere',
      },
    };

    const location: Location = {
      state: undefined,
      key: '',
      pathname: '/somewhere',
      search: '',
      hash: ''
    }
    const onChangeHandler = createChangeHandler(queryParam, location);
    const props = {
      onChangeHandler,
      placeholder: '',
    };
    const wrapper = mount(
      <Router>
        <SearchForm {...props} />
      </Router>
    );

    console.log(location)
    wrapper.find('input').simulate('change', { target: { value: 'test' } });
    expect(location.search).toEqual('?randomString=test');

    // simulate clear
    wrapper.find('.ant-input-clear-icon').first().simulate('click');
    wrapper.update();
    expect(history.location.search).toEqual('');
  });
});
