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
import Form, { onSubmit } from '../Form';

describe('Team-management/TeamsAddEdit/Form', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

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
  });

  it('Cancel button', () => {
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

    wrapper.find('button#cancel').simulate('click');
  });

  it('Create TeamsAddEdit', async () => {
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

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });

  it('Fail Create TeamsAddEdit', async () => {
    fetch.mockRejectOnce(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');

    onSubmit(accessToken, intialValue, practitioners).then(jest.fn(), mockNotificationError);

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
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
});
