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
import { defaultInitialValues, CreateEditPractitionerRole } from '..';
import toJson from 'enzyme-to-json';
import lang from '../../../lang';

const { QueryClientProvider } = reactQuery;

const testQueryClient = createTestQueryClient();

/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/CreateEditPractitionerRole', () => {
  const props = {
    history,
    fhirBaseURL: 'https://r4.smarthealthit.org/',
    location: {
      hash: '',
      pathname: '/PractitionerRole/edit',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { practitionerRoleId: fixtures.practitionerRole1.id },
      path: `/PractitionerRole/edit/:practitionerRoleId`,
      url: `/PractitionerRole/edit/${fixtures.practitionerRole1.id}`,
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
            <CreateEditPractitionerRole {...props} />
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
          request: jest.fn().mockResolvedValueOnce(fixtures.practitionerRole1),
        };
      })
    );

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditPractitionerRole {...props} />
        </QueryClientProvider>
      </Router>
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const row = wrapper.find('Row').at(0);

    expect(row.text()).toMatchSnapshot('full practitioner role form');

    wrapper.unmount();
  });

  it('renders correctly for create practitioner role', async () => {
    const propsCreate = {
      history,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
      location: {
        hash: '',
        pathname: '/PractitionerRole/new',
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: { practitionerRoleId: '' },
        path: `/PractitionerRole/new`,
        url: `/PractitionerRole/new`,
      },
    };

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditPractitionerRole {...propsCreate} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const row = wrapper.find('Row').at(0);

    expect(row.find('PractitionerRoleForm').prop('initialValues')).toEqual(defaultInitialValues);

    wrapper.unmount();
  });

  it('fetches practitioner roles if page is refreshed', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fixtures.practitionerRole1),
        };
      })
    );
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditPractitionerRole {...props} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // check if form initial values are set

    expect(wrapper.find('PractitionerRoleForm').props().initialValues).toEqual({
      active: true,
      id: '388',
      orgsId: '105',
      practitionersId: '206',
      uuid: 'b3046485-1591-46b4-959f-02db30a2f622',
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
          <CreateEditPractitionerRole {...props} />
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
