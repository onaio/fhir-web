import { mount, shallow } from 'enzyme';
import { EditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import * as reactQuery from 'react-query';
import * as fhirCient from 'fhirclient';
import { createBrowserHistory } from 'history';
import { RouteComponentProps, Router } from 'react-router';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { authenticateUser } from '@onaio/session-reducer';
import { fhirHierarchy } from '../../LocationUnitList/tests/fixtures';
import { location1 } from '../../LocationForm/tests/fixtures';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import { singleLocation } from './fixtures';
import flushPromises from 'flush-promises';

const history = createBrowserHistory();

const path = '/locations/edit';
const locationId = location1.id;
const locationProps = {
  history,
  fhirBaseURL: 'https://r4.smarthealthit.org/',
  location: {
    hash: '',
    pathname: `${'/locations/edit/'}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { id: locationId },
    path: `${path}`,
    url: `${path}/${locationId}`,
  },
};

describe('EditLocationUnit', () => {
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // jest.resetAllMocks();
  });

  it('renders without crashing', async () => {
    const queryClient = new QueryClient();

    shallow(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
  });

  it('renders correctly', async () => {
    const queryClient = new QueryClient();

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fhirHierarchy),
        };
      })
    );
    // mock react query return value
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockReturnValue({
      data: singleLocation,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    reactQueryMock.mockReturnValue({
      data: fhirHierarchy,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      await flushPromises();
    });

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    wrapper.update();

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Edit > Kenya');

    // rendered page including title
    expect(wrapper.find('h5').text()).toMatchInlineSnapshot(`"Edit > Kenya"`);

    expect(wrapper.find('LocationForm').text()).toMatchSnapshot('form rendered');

    // check isJurisdiction status passed to form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // expect((wrapper.find('LocationForm').props() as any).initialValues.isJurisdiction).toBeTruthy();
  });

  it('renders correctly when location is structure', async () => {
    const queryClient = new QueryClient();

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check isJurisdiction status passed to form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('LocationForm').props() as any).initialValues.isJurisdiction).toBeFalsy();
  });

  it('renders errorPage correctly', async () => {
    const queryClient = new QueryClient();

    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('Error'),
        };
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(`""`);
  });

  it('renders resource404 when location is not found', async () => {
    const queryClient = new QueryClient();
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('Error'),
        };
      })
    );

    const props = {
      ...locationProps,
      match: {
        ...locationProps.match,
        params: { id: 'unknown' },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...props} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // resource not found
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });

  it('cancel url is used if passed', async () => {
    const queryClient = new QueryClient();
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const cancelURL = '/canceledURL';

    const props = {
      ...locationProps,
      match: {
        ...locationProps.match,
        params: { id: location1.id },
      },
      cancelURLGenerator: () => cancelURL,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...props} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // simulate click on cancel button
    wrapper.find('button#location-form-cancel-button').simulate('click');
    wrapper.update();

    // check url
    expect(
      (wrapper.find('Router').props() as RouteComponentProps).history.location.pathname
    ).toEqual(cancelURL);
  });
});
