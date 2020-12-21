import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';

import { accessToken, id, intialValue, practitioners } from './fixtures';
import Form from '../Form';

describe('Team-management/TeamsAddEdit/Form', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchObject([]);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders without crashing with id', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            id={id}
            initialValue={intialValue}
            accessToken={accessToken}
            practitioner={practitioners}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('Form').prop('initialValue')).toMatchObject(intialValue);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('Cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button#cancel').simulate('click');
    expect(history.goBack).toBeCalled();
  });

  it('Add Practinier field', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    wrapper.find('button#addPractitioner').simulate('click');
    expect(wrapper.find('List[name="practitioners"] div.practitioners_Field')).toHaveLength(2);
  });

  it('Remove Practinier field', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    wrapper.find('button#addPractitioner').simulate('click');
    expect(wrapper.find('List[name="practitioners"] div.practitioners_Field')).toHaveLength(2);
    wrapper.find('button.removePractitioner').last().simulate('click');
    expect(wrapper.find('List[name="practitioners"] div.practitioners_Field')).toHaveLength(1);
  });

  it('fail and test call onsubmit', async () => {
    const mockNotificationError = jest.spyOn(notification, 'error');
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} initialValue={intialValue} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
  });
});
