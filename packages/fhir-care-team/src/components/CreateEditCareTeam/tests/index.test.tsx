import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import nock from 'nock';
import * as fhirCient from 'fhirclient';
import { authenticateUser } from '@onaio/session-reducer';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import * as reactQuery from 'react-query';
import * as fixtures from './fixtures';
import flushPromises from 'flush-promises';
import { createTestQueryClient } from '../../ListView/tests/utils';
import * as notifications from '@opensrp/notifications';
import { defaultInitialValues, CreateEditCareTeam } from '..';
import lang from '../../../lang';
import { Dictionary } from '@onaio/utils';
import { Practitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/practitioner';
import { getPatientName } from '../utils';

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
    resourcePageSize: 500,
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
    nock('https://r4.smarthealthit.org').get('/CareTeam/308').reply(200, fixtures.careTeam1);
  });

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
    // mock react query return value
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockImplementation(async () => {
            throw new Error('Something went wrong');
          }),
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

    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);

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
      resourcePageSize: 500,
    };

    // mock react query return value
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockReturnValueOnce({
      data: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.groups,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.practitioners,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <CreateEditCareTeam {...propsCreate} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const row = wrapper.find('Row').at(0);

    expect(row.find('CareTeamForm').prop('initialValues')).toEqual(defaultInitialValues);

    wrapper.unmount();
  });

  it('fetches care team if page is refreshed', async () => {
    // mock react query return value
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.careTeam1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.groups,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.practitioners,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

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
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('API Failed'),
        };
      })
    );
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

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

  it('does not show inactive practitioners', async () => {
    // mock react query return value
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.careTeam1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.groups,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValueOnce({
      data: fixtures.practitioners,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // get list of all inactive practitioners
    const inactivePractitioners = fixtures.practitionerBundle.flatMap((e: Dictionary) =>
      (e.resource as Practitioner).active === false ? [getPatientName(e.resource)] : []
    );

    expect(inactivePractitioners).toStrictEqual([
      'Allay Allan',
      'brian krebs',
      'marcus brownlee',
      'julian assange',
    ]);

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

    // find antd Select with id 'practitionersId' in the component
    const practitionersSelect = wrapper.find('CareTeamForm').find('Select#practitionersId');

    // simulate click on select - to show dropdown items
    practitionersSelect.find('.ant-select-selector').simulate('mousedown');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see all options (practitioners)
    const practitionersSelect2 = wrapper.find('CareTeamForm').find('Select#practitionersId');
    // find antd select options
    const selectOptions = practitionersSelect2.find('.ant-select-item-option-content');

    // expect all practitioners (except inactive ones)
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual([
      'Ward N Williams MD',
      'Ward N Williams MD',
      'Ward N Williams MD',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
    ]);

    wrapper.unmount();
  });
});
