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
import { OrganizationPOST } from '../../../ducks/organizations';
import { PractitionerPOST } from '../../../ducks/practitioners';
import { ERROR_OCCURRED } from '../../../constants';

describe('Team-management/TeamsAddEdit/Form', () => {
  beforeEach(() => {
    fetch.resetMocks();
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
    const historyback = jest.spyOn(history, 'goBack');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button#cancel').simulate('click');
    expect(historyback).toBeCalled();
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
      message: ERROR_OCCURRED,
    });
  });

  it('Create Team', async () => {
    onSubmit(jest.fn, practitioners, accessToken, intialValue, {
      active: true,
      name: '',
      practitioners: [''],
    });

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: intialValue.active,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST)
              .identifier,
            name: intialValue.name,
            type: {
              coding: [
                {
                  code: 'team',
                  display: 'Team',
                  system: 'http://terminology.hl7.org/CodeSystem/organization-type',
                },
              ],
            },
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/add/',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify([
            {
              active: true,
              identifier: (JSON.parse(fetch.mock.calls[1][1].body as string)[0] as PractitionerPOST)
                .identifier,
              practitioner: '1',
              organization: (JSON.parse(
                fetch.mock.calls[1][1].body as string
              )[0] as PractitionerPOST).organization,
              code: { text: 'Community Health Worker' },
            },
            {
              active: true,
              identifier: (JSON.parse(fetch.mock.calls[1][1].body as string)[1] as PractitionerPOST)
                .identifier,
              practitioner: '2',
              organization: (JSON.parse(
                fetch.mock.calls[1][1].body as string
              )[1] as PractitionerPOST).organization,
              code: { text: 'Community Health Worker' },
            },
            {
              active: true,
              identifier: (JSON.parse(fetch.mock.calls[1][1].body as string)[2] as PractitionerPOST)
                .identifier,
              practitioner: '3',
              organization: (JSON.parse(
                fetch.mock.calls[1][1].body as string
              )[2] as PractitionerPOST).organization,
              code: { text: 'Community Health Worker' },
            },
          ]),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('Edit Team', async () => {
    onSubmit(
      jest.fn,
      practitioners,
      accessToken,
      intialValue,
      { active: false, name: '', practitioners: ['3', '4', '5'] },
      id
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: intialValue.active,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST)
              .identifier,
            name: intialValue.name,
            type: {
              coding: [
                {
                  code: 'team',
                  display: 'Team',
                  system: 'http://terminology.hl7.org/CodeSystem/organization-type',
                },
              ],
            },
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/delete/4',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/delete/5',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/add/',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[3][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('fail delete Team practitioner', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    fetch.mockReject();
    onSubmit(
      jest.fn,
      practitioners,
      accessToken,
      intialValue,
      { active: false, name: '', practitioners: ['3', '4', '5'] },
      id
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: intialValue.active,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST)
              .identifier,
            name: intialValue.name,
            type: {
              coding: [
                {
                  code: 'team',
                  display: 'Team',
                  system: 'http://terminology.hl7.org/CodeSystem/organization-type',
                },
              ],
            },
          }),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/delete/4',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/delete/5',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitionerRole/add/',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[3][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });
});
