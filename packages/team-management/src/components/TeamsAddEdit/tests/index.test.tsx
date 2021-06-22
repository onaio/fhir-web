import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Router } from 'react-router';
import { id, intialValue, opensrpBaseURL, practitioners, team } from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import { notification } from 'antd';

import TeamsAddEdit, { getPractitionerDetail, getTeamDetail } from '..';
import lang from '../../../lang';

describe('Team-management/TeamsAddEdit/TeamsAddEdit', () => {
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
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsAddEdit opensrpBaseURL={opensrpBaseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/',
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
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/',
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
          <Route path={'/:id'} component={TeamsAddEdit} />
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
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/',
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
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/',
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
      `"Edit Team | Test Test TeamTeam NameStatusActiveInactiveTeam Membersprac twoBenjamin Mulyungitest admin SaveCancel"`
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
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
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
      'prac two',
      'Benjamin Mulyungi',
      'test admin',
    ]);
  });
});
