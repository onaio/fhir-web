import { store } from '@onaio/redux-reducer-registry';
import { mount, shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { getFilteredDataArray } from '../../../ducks';
import { SearchBar } from '..';

const history = createBrowserHistory();

describe('components/SearchBar', () => {
  it('renders without crashing', () => {
    const props = {
      onChangeHandler: jest.fn(),
      placeholder: 'Random string',
    };
    shallow(
      <Provider store={store}>
        <SearchBar {...props} />
      </Provider>
    );
  });
  it('renders correctly', () => {
    const props = {
      placeholder: 'Random string',
      filterField: 'name',
    };
    const wrapper = mount(
      <Provider store={store}>
        <SearchBar {...props} />
      </Provider>
    );
    expect(wrapper.find('.ant-input')).toHaveLength(1);
    wrapper.unmount();
  });

  it('handles submit correctly with default changeHandler', () => {
    const props = {
      placeholder: 'Enter Name',
      filterField: 'name',
      data: [
        {
          id: '1',
          key: '1',
          name: 'test name',
          username: 'test_name',
        },
      ],
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <SearchBar {...props} />
        </Router>
      </Provider>
    );

    wrapper.find('.ant-input').simulate('change', { target: { value: 'test name' } });

    wrapper.update();

    expect(wrapper.find('.ant-input').props().value).toEqual('test name');

    expect(getFilteredDataArray(store.getState())).toHaveLength(1);

    wrapper.find('.ant-input').simulate('change', { target: { value: 'one' } });

    wrapper.update();

    expect(wrapper.find('.ant-input').props().value).toEqual('one');

    expect(getFilteredDataArray(store.getState())).toHaveLength(0);

    wrapper.unmount();
  });

  it('handles submit correctly when provided changeHandler as prop', () => {
    const onChangeHandlerMock = jest.fn();
    const props = {
      placeholder: 'Enter Name',
      filterField: 'name',
      onChangeHandler: onChangeHandlerMock,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <SearchBar {...props} />
        </Router>
      </Provider>
    );

    wrapper.find('.ant-input').simulate('change', { target: { value: 'test name' } });

    wrapper.update();

    expect(onChangeHandlerMock.mock.calls[0][0].target.value).toEqual('test name');
    wrapper.unmount();
  });
});
