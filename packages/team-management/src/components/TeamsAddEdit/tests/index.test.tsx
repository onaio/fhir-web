import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Router } from 'react-router';
import { id, intialValue, opensrpBaseURL, practitioners, team, practitionerRole } from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import { notification } from 'antd';

import TeamsAddEdit, { getPractitionerDetail, getTeamDetail } from '..';
import lang from '../../../lang';

describe('Team-management/TeamsAddEdit/TeamsAddEdit', () => {
  const props = {
    opensrpBaseURL,
    disableTeamMemberReassignment: false,
  };
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', async () => {
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsAddEdit {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/practitioner/count/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner?pageNumber=1&pageSize=1000',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.unmount();
  });

  it('renders with id without crashing', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(team));
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={() => <TeamsAddEdit {...props} />} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner/count/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner?pageNumber=1&pageSize=1000',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Fail setupInitialValue', async () => {
    const mockNotificationError = jest.spyOn(notification, 'error');

    fetch.mockReject();

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={() => <TeamsAddEdit {...props} />} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: lang.ERROR_OCCURRED,
    });
  });

  it('test getPractitionerDetail', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    const response = await getPractitionerDetail(id, opensrpBaseURL);

    await act(async () => {
      await flushPromises();
    });

    expect(response).toMatchObject(practitioners.filter((e) => e.active));
  });

  it('test getTeamDetail', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(
      JSON.stringify({
        name: intialValue.name,
        active: intialValue.active,
      })
    );

    const response = await getTeamDetail(id, opensrpBaseURL);

    await act(async () => {
      await flushPromises();
    });

    expect(response).toMatchObject({
      name: intialValue.name,
      active: intialValue.active,
      practitioners: practitioners.filter((e) => e.active),
    });
  });

  it('render with correct team name in header', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(team));
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={() => <TeamsAddEdit {...props} />} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner/count/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner?pageNumber=1&pageSize=1000',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('.mb-3.header-title').text()).toEqual(`Edit Team | ${team.name}`);
    wrapper.unmount();
  });

  it('correctly adds/removes members from team', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(team));
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={() => <TeamsAddEdit {...props} />} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some.opensrp.url/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner/count/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some.opensrp.url/practitioner?pageNumber=1&pageSize=1000',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      // eslint-disable-next-line no-irregular-whitespace
      `"Edit Team | Test Test TeamTeam NameStatusActiveInactiveTeam Membersanon opsprac twoBenjamin Mulyungitest admin SaveCancel"`
    );
    // trigger team member change
    (wrapper.find('Select').props() as Dictionary).onChange(
      ['1'],
      [{ label: 'prac two', value: '1' }]
    );
    wrapper.update();
    expect(wrapper.text()).toMatchInlineSnapshot(
      // eslint-disable-next-line no-irregular-whitespace
      `"Edit Team | Test Test TeamTeam NameStatusActiveInactiveTeam Membersprac two SaveCancel"`
    );
    wrapper.unmount();
  });

  it('renders with inactive practitioners filtered out', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(team));
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={() => <TeamsAddEdit {...props} />} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find antd Select with id 'practitioners' in the 'Form' component
    const practitionersSelect = wrapper.find('Form').find('Select#practitioners');

    // find antd select items (prefixed with 'ant-select-selection-item-content' css class)
    const options = practitionersSelect.find('.ant-select-selection-item-content');

    // filter practitioners against inactive users
    const filteredPractitioners = practitioners.filter((practitioner) => practitioner.active);
    // only return the names
    const filteredPractitionerNames = filteredPractitioners.map(
      (practitioner) => practitioner.name
    );

    // expect antd select options text to equal practitioners filtered for only active users
    expect(options.map((opt) => opt.text())).toStrictEqual(filteredPractitionerNames);

    // get default displayed practitioners
    const defaultPractitioners = practitionersSelect.find('.ant-select-selection-item-content');
    // expect them to match default active practitioners
    expect(defaultPractitioners.map((opt) => opt.text())).toStrictEqual([
      'anon ops',
      'prac two',
      'Benjamin Mulyungi',
      'test admin',
    ]);
  });

  it('configurable filtering out of already assigned practitioners', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners.slice(4))); // subset of all practitioners - from index 4 to end of arr
    fetch.mockResponseOnce(JSON.stringify(team));
    fetch.mockResponseOnce(JSON.stringify(practitionerRole)); // with practitioner id matching the active subset's identifier id
    // practitioner count endpoint - pageSize === 1k. so if resp < 1k, pageNumber = 1
    fetch.mockResponseOnce(JSON.stringify(900));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    // enable filtering out configuration
    const configuredProps = {
      ...props,
      disableTeamMemberReassignment: true,
    };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: `admin/teams/edit/${id}`, hash: '', search: '', state: {} }]}
        >
          <Route
            exact
            path="admin/teams/edit/:id"
            component={() => <TeamsAddEdit {...configuredProps} />}
          />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find antd Select with id 'practitioners' in the 'Form' component
    const practitionersSelect = wrapper.find('Form').find('Select#practitioners');
    // find antd select items (prefixed with 'ant-select-selection-item-content' css class)
    const options = practitionersSelect.find('.ant-select-selection-item-content');
    //  should be equal to array of all active elements in the subset
    expect(options.map((opt) => opt.text())).toMatchInlineSnapshot(`
      Array [
        "Benjamin Mulyungi",
        "test admin",
      ]
    `);

    // simulate click on select - to show dropdown items
    practitionersSelect.find('.ant-select-selector').simulate('mousedown');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const practitionersSelect2 = wrapper.find('Form').find('Select#practitioners');
    // find antd select options
    const selectOptions = practitionersSelect2.find('.ant-select-item-option-content');
    // expect all active options - except those who are team members elsewhere (practitioners[0])
    expect(selectOptions.map((opt) => opt.text())).toMatchInlineSnapshot(`
      Array [
        "Benjamin Mulyungi",
        "test admin",
        "prac two",
      ]
    `);
  });
});
