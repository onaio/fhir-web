import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';

import { opensrpBaseURL, id, intialValue, practitioners } from './fixtures';
import Form, { onSubmit } from '../Form';
import { Organization, OrganizationPOST } from '../../../ducks/organizations';

const mockV4 = 'b0c20f20-c1c0-4ea3-b855-4fcb23f6ae2a';

jest.mock('uuid', () => {
  const v4 = () => mockV4;

  return {
    __esModule: true,
    ...Object.assign({}, jest.requireActual('uuid')),
    v4,
  };
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// mock out antd (multi)select
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const Select = ({
    mode,
    value,
    defaultValue,
    id,
    onChange,
    children,
  }: {
    mode: string;
    value: string[];
    defaultValue: string[];
    id: string;
    onChange: (e: string | string[]) => void;
    children: React.ReactNode;
  }) => {
    const multiple = ['tags', 'multiple'].includes(mode);

    return (
      <select
        value={value}
        defaultValue={defaultValue}
        multiple={multiple}
        id={id}
        onChange={(e) =>
          onChange(
            multiple
              ? Array.from(e.target.selectedOptions).map((option) => option.value)
              : e.target.value
          )
        }
      >
        {children}
      </select>
    );
  };

  const Option = ({ children, ...otherProps }: { children: React.ReactNode }) => (
    <option {...otherProps}>{children}</option>
  );

  Select.Option = Option;

  return { ...antd, Select };
});

describe('Team-management/TeamsAddEdit/Form', () => {
  const members = [
    {
      identifier: '3',
      active: false,
      name: 'prac one',
      userId: '3',
      username: 'prac_one',
    },
    {
      identifier: '4',
      active: false,
      name: 'Practitioner Two',
      userId: '4',
      username: 'prac_two',
    },
    {
      identifier: '5',
      active: false,
      name: 'Practitioner One',
      userId: '5',
      username: 'practitioner_one',
    },
  ];
  afterEach(() => {
    fetch.resetMocks();
  });

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={opensrpBaseURL}
            practitioners={practitioners}
            disableTeamMemberReassignment={false}
          />
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
            opensrpBaseURL={opensrpBaseURL}
            initialValue={intialValue}
            practitioners={practitioners}
            disableTeamMemberReassignment={false}
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
          <Form
            opensrpBaseURL={opensrpBaseURL}
            practitioners={practitioners}
            disableTeamMemberReassignment={false}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button#cancel').simulate('click');
    expect(historyback).toBeCalled();
    expect(history.location.pathname).toBe('/');
  });

  it('fail and test call onsubmit', async () => {
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(new Error('An error occurred'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={opensrpBaseURL}
            practitioners={practitioners}
            initialValue={intialValue}
            disableTeamMemberReassignment={false}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem updating teams');
  });

  it('Create Team', async () => {
    onSubmit(
      opensrpBaseURL,
      jest.fn,
      practitioners,
      intialValue,
      {
        active: true,
        name: 'New team name',
        practitioners: [],
        practitionersList: [],
      },
      (t) => t
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: intialValue.active,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST)
              .identifier,
            name: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST).name,
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
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=0&organization=b0c20f20-c1c0-4ea3-b855-4fcb23f6ae2a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=1&organization=b0c20f20-c1c0-4ea3-b855-4fcb23f6ae2a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=2&organization=b0c20f20-c1c0-4ea3-b855-4fcb23f6ae2a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
    ]);
  });

  it('Edit Team', async () => {
    onSubmit(
      opensrpBaseURL,
      jest.fn,
      practitioners,
      intialValue,
      {
        active: false,
        name: 'new name',
        practitioners: ['2', '3', '4'],
        practitionersList: members,
      },
      (t) => t,
      id
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: false,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as Organization)
              .identifier,
            name: 'new name',
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
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=0&organization=258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=1&organization=258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/add/',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[3][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
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
      opensrpBaseURL,
      jest.fn,
      practitioners,
      intialValue,
      {
        active: false,
        name: 'new name',
        practitioners: ['2', '3', '4'],
        practitionersList: members,
      },
      (t) => t,
      id
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify({
            active: false,
            identifier: (JSON.parse(fetch.mock.calls[0][1].body as string) as OrganizationPOST)
              .identifier,
            name: 'new name',
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
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=0&organization=258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/deleteByPractitioner?practitioner=1&organization=258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://some.opensrp.url/practitionerRole/add/',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[3][1].body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('renders with default team members with option to add', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            id={id}
            opensrpBaseURL={opensrpBaseURL}
            initialValue={intialValue}
            practitioners={practitioners}
            disableTeamMemberReassignment={false}
          />
        </Router>
      </Provider>
    );

    // find select with id 'practitioners'
    const practitionersSelect = wrapper.find('select#practitioners');

    // get it's value props
    const values = practitionersSelect.props().value;

    // expect default values to be a subset of all options
    expect(values).toMatchInlineSnapshot(`
      Array [
        "0",
        "1",
        "2",
      ]
    `);

    const options = practitionersSelect.find('option');
    expect(options.map((opt) => opt.props().value)).toStrictEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ]);

    // expect default values to match existing practitioners

    // get all practitioner objects matching default values
    const defaultPractitioners = practitioners.filter((practitioner) =>
      (values as readonly string[]).includes(practitioner.identifier)
    );

    // expect object with names whose identifiers match default values
    expect(defaultPractitioners).toMatchSnapshot('default practitioner objects');

    // simulate change
    // add '6' to default values
    practitionersSelect.simulate('change', {
      target: {
        selectedOptions: [
          ...(values as string[]).map((value) => ({
            value,
          })),
          { value: '6' },
        ],
      },
    });

    // re-find updated select with id 'practitioners'
    const practitionersSelect2 = wrapper.find('select#practitioners');

    // '6' is added to its value prop
    expect(practitionersSelect2.props().value).toStrictEqual(['0', '1', '2', '6']);
  });
});
