import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import * as fhirCient from 'fhirclient';
import * as reactQuery from 'react-query';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import LocationUnitList from '..';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import { fhirHierarchy } from './fixtures';
import { baseURL } from '../../../constants';
import { QueryClient, QueryClientProvider } from 'react-query';

LocationUnitList.defaultProps = { opensrpBaseURL: baseURL };

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('location-management/src/components/LocationUnitList', () => {
  const queryClient = new QueryClient();
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

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders locations list view without crashing', async () => {
    shallow(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <LocationUnitList
            opensrpBaseURL={baseURL}
            fhirBaseURL="https://r4.smarthealthit.org/"
            fhirRootLocationIdentifier="eff94f33-c356-4634-8795-d52340706ba9"
          />
        </QueryClientProvider>
      </Router>
    );
  });

  it('location unit table renders correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList
              opensrpBaseURL={baseURL}
              fhirBaseURL="https://r4.smarthealthit.org/"
              fhirRootLocationIdentifier="eff94f33-c356-4634-8795-d52340706ba9"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('Table').first().props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('change table view when clicked on tree node', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList
              opensrpBaseURL={baseURL}
              fhirBaseURL="https://r4.smarthealthit.org/"
              fhirRootLocationIdentifier="eff94f33-c356-4634-8795-d52340706ba9"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // // using index 0 cuz after sorting by name that is the last one
    const tableFirstRow = {
      description:
        'This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.',
      id: '2252',
      key: undefined,
      name: 'Root FHIR Location',
      partOf: '-',
      physicalType: 'Jurisdiction',
      status: 'active',
    };

    expect(wrapper.find('tbody BodyRow').last().prop('record')).toEqual(tableFirstRow);

    // test table with tree node with child
    const treeItemwithchild = wrapper.find('span.ant-tree-title').first();
    treeItemwithchild.simulate('click');
    wrapper.update();
    await act(async () => {
      await flushPromises();
    });
    expect(wrapper.find('tbody BodyRow').last().prop('record')).toEqual({
      description: 'The Sub location',
      id: '303',
      key: undefined,
      name: 'Ona Office Sub Location',
      partOf: 'Root FHIR Location',
      physicalType: 'Jurisdiction',
      status: 'active',
    });
    expect(wrapper.find('tbody BodyRow').last().prop('record')).not.toMatchObject(tableFirstRow); // table changed
  });

  it('test Open and close view details', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList
              opensrpBaseURL={baseURL}
              fhirBaseURL="https://r4.smarthealthit.org/"
              fhirRootLocationIdentifier="eff94f33-c356-4634-8795-d52340706ba9"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const firstAction = wrapper.find('.Actions').first();
    firstAction.find('button').last().simulate('click');

    // test out loading animation works correctly
    expect(wrapper.find('.ant-spin')).toHaveLength(1);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.ant-spin')).toHaveLength(0);
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(1);

    // close LocationUnitDetail
    wrapper.find('LocationUnitDetail button').simulate('click');
    wrapper.update();
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(0);
    wrapper.unmount();
  });

  it('fail loading location hierarchy', async () => {
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockImplementation(
      () =>
        ({
          data: undefined,
          error: 'Something went wrong',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList
              opensrpBaseURL={baseURL}
              fhirBaseURL="https://r4.smarthealthit.org/"
              fhirRootLocationIdentifier="eff94f33-c356-4634-8795-d52340706ba9"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorAn error occurredGo backGo home"`);
    wrapper.unmount();
  });
});
