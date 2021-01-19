import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Router } from 'react-router';
import { accessToken, id, intialValue, practitioners, team } from './fixtures';
import fetch from 'jest-fetch-mock';
import { notification } from 'antd';

import TeamsAddEdit, { getPractitonerDetail, getTeamDetail } from '..';
import { ERROR_OCCURRED } from '../../../constants';

describe('Team-management/TeamsAddEdit/TeamsAddEdit', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsAddEdit />
        </Router>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchObject([
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
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders with id without crashing', async () => {
    fetch.mockResponseOnce(JSON.stringify(team));
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchObject([
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
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('form')).toHaveLength(1);
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
      message: ERROR_OCCURRED,
    });
  });

  it('test getPractitonerDetail', async () => {
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    const response = await getPractitonerDetail(accessToken, id);

    await act(async () => {
      await flushPromises();
    });

    expect(response).toMatchObject(practitioners.filter((e) => e.active));
  });

  it('test getTeamDetail', async () => {
    fetch.mockResponseOnce(JSON.stringify({ name: intialValue.name, active: intialValue.active }));
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    const response = await getTeamDetail(accessToken, id);

    await act(async () => {
      await flushPromises();
    });

    expect(response).toMatchObject({
      name: intialValue.name,
      active: intialValue.active,
    });
  });

  it('render with correct team name in header', async () => {
    fetch.mockResponseOnce(JSON.stringify(team));
    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify(practitioners));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={TeamsAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchObject([
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
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('.mb-3.header-title').text()).toEqual(`Edit Team | ${team.name}`);
  });
});
