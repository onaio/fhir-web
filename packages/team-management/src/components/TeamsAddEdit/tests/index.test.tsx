import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Router } from 'react-router';
import { id, practitioner, practitioners, team } from './fixtures';
import fetch from 'jest-fetch-mock';

import TeamsAddEdit, { getTeamDetail, getPractinonerDetail } from '..';
import toJson from 'enzyme-to-json';

describe('Team-management/TeamsAddEdit/TeamsAddEdit', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsAddEdit />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
  });

  it('renders with id without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path="/:id" component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
  });

  it('works correctly with store', async () => {
    fetch
      .once(JSON.stringify(practitioners))
      .once(JSON.stringify(practitioner))
      .once(JSON.stringify(team));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path="/:id" component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const fetchCalls = [
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/practitioner/258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ];

    expect(fetch.mock.calls).toMatchSnapshot();
    expect(fetch.mock.calls).toEqual(fetchCalls);
  });
});
