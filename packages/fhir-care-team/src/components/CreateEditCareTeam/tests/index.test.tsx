import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import * as reactQuery from 'react-query';
import * as fixtures from './fixtures';
import * as fhirCient from 'fhirclient';
import flushPromises from 'flush-promises';
import { createTestQueryClient } from '../../ListView/tests/utils';
import * as notifications from '@opensrp/notifications';
import { defaultInitialValues, CreateEditCareTeam } from '..';
import toJson from 'enzyme-to-json';
import lang from '../../../lang';

const { QueryClientProvider } = reactQuery;

const testQueryClient = createTestQueryClient();

/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/CreateEditCareTeam', () => {
  const props = {
    history,
    fhirBaseURL: 'https://r4.smarthealthit.org/',
    location: {
      hash: '',
      pathname: '/CareTeam/edit',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { careTeamId: fixtures.careTeam1.id },
      path: `/CareTeam/edit/:careTeamId`,
      url: `/CareTeam/edit/${fixtures.careTeam1.id}`,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    act(() => {
      shallow(
        <Router history={history}>
          <QueryClientProvider client={testQueryClient}>
            <CreateEditCareTeam {...props} />
          </QueryClientProvider>
        </Router>
      );
    });
  });

  it('renders correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(fixtures.careTeam1),
        };
      })
    );

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditCareTeam {...props} />
        </QueryClientProvider>
      </Router>
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const row = wrapper.find('Row').at(0);

    expect(row.text()).toMatchSnapshot('full care tem form');

    wrapper.unmount();
  });

  it('renders correctly for create care team', async () => {
    const propsCreate = {
      history,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
      location: {
        hash: '',
        pathname: '/CareTeam/new',
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: { careTeamId: '' },
        path: `/CareTeam/new`,
        url: `/CareTeam/new`,
      },
    };

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditCareTeam {...propsCreate} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const row = wrapper.find('Row').at(0);

    expect(row.find('CareTeamForm').prop('initialValues')).toEqual(defaultInitialValues);

    wrapper.unmount();
  });

  it('fetches care team if page is refreshed', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fixtures.careTeam1),
        };
      })
    );
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditCareTeam {...props} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // check if form initial values are set

    expect(wrapper.find('CareTeamForm').props().initialValues).toEqual({
      groupsId: '306',
      id: '308',
      name: 'Care Team One',
      practitionersId: ['206', '103'],
      status: 'active',
      uuid: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    });

    wrapper.unmount();
  });

  it('handles error if fetch fails when page reloads', async () => {
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('Failed'),
        };
      })
    );

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditCareTeam {...props} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
    wrapper.unmount();
  });
});
