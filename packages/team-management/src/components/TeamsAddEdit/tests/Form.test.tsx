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

import { accessToken, id, intialValue, practitioners, teamPost } from './fixtures';
import Form, { onSubmit, setTeam } from '../Form';

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

  it('Fail onSubmit', async () => {
    fetch.mockRejectOnce(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    onSubmit(practitioners, accessToken, intialValue, id, jest.fn());
    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
  });

  it('Create setTeam', async () => {
    fetch.mockResponse(JSON.stringify({}));

    setTeam(accessToken, teamPost).then(jest.fn, jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[0][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
  });

  it('Edit setTeam', async () => {
    fetch.mockResponse(JSON.stringify({}));

    setTeam(accessToken, teamPost, id).then(jest.fn, jest.fn);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[0][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
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
