import { mount, shallow } from 'enzyme';
import { EditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { RouteComponentProps, Router } from 'react-router';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { removeLocationUnits } from '../../../ducks/location-units';
import { authenticateUser } from '@onaio/session-reducer';
import { baseLocationUnits, location1, rawHierarchy } from '../../LocationForm/tests/fixtures';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import flushPromises from 'flush-promises';
import toJson from 'enzyme-to-json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

const path = '/locations/edit';
const locationId = location1.id;
const locationProps = {
  history,
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(removeLocationUnits());
  });

  it('renders without crashing', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponse(JSON.stringify([]));

    shallow(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <EditLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
  });

  it('renders correctly when location is jurisdiction', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(location1));
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

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
      await flushPromises();
      wrapper.update();
    });

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Edit > Kenya');

    // rendered page including title
    expect(wrapper.find('PageHeader').text()).toMatchInlineSnapshot(`"Edit > Kenya"`);

    expect(wrapper.find('LocationForm').text()).toMatchSnapshot('form rendered');

    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/b652b2f4-a95d-489b-9e28-4629746db96a?return_geometry=true&is_jurisdiction=true',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[1]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/b652b2f4-a95d-489b-9e28-4629746db96a?return_geometry=true&is_jurisdiction=false',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    // check isJurisdiction status passed to form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('LocationForm').props() as any).initialValues.isJurisdiction).toBeTruthy();
  });

  it('stops showing loader after promise resolution', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponse(JSON.stringify([]));

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
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();

    // location was not found
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );

    wrapper.unmount();
  });

  it('renders correctly when location is structure', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(location1));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

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
      await flushPromises();
      wrapper.update();
    });

    // check isJurisdiction status passed to form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('LocationForm').props() as any).initialValues.isJurisdiction).toBeFalsy();
  });

  it('renders errorPage correctly', async () => {
    const queryClient = new QueryClient();
    const errorMessage = 'An error happened';
    fetch.mockReject(new Error(errorMessage));

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
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(`""`);
  });

  it('renders resource404 when location is not found', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(location1));
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

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
      await flushPromises();
      wrapper.update();
    });

    // resource not found
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });

  it('cancel url is used if passed', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(location1));
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

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
      await flushPromises();
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
