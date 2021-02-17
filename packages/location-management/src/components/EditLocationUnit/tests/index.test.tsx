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
import { location1 } from '../../LocationForm/tests/fixtures';
import { act } from 'react-dom/test-utils';

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(removeLocationUnits());
  });

  it('renders without crashing', async () => {
    fetch.mockResponse(JSON.stringify([]));
    shallow(
      <Provider store={store}>
        <Router history={history}>
          <EditLocationUnit {...locationProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  it('renders correctly when location is jurisdiction', async () => {
    fetch.once(JSON.stringify(location1));
    fetch.once(JSON.stringify(null));
    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <EditLocationUnit {...locationProps} />
        </Router>
      </Provider>
    );

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Edit > Kenya');

    // rendered page including title
    expect(wrapper.find('h5').text()).toMatchInlineSnapshot(`"Edit > Kenya"`);

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

  it('renders correctly when location is structure', async () => {
    fetch.once(JSON.stringify(null));
    fetch.once(JSON.stringify(location1));
    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <EditLocationUnit {...locationProps} />
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
    const errorMessage = 'An error happened';
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <EditLocationUnit {...locationProps} />
        </Router>
      </Provider>
    );

    // loading page
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorAn error happenedGo BackBack Home"`);
  });

  it('renders resource404 when location is not found', async () => {
    fetch.once(JSON.stringify(null));
    fetch.once(JSON.stringify(location1));
    fetch.mockResponse(JSON.stringify([]));

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
          <EditLocationUnit {...props} />
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
      `"404Sorry, the resource you requested for, does not existGo BackBack Home"`
    );
  });

  it('cancel url is used if passed', async () => {
    fetch.once(JSON.stringify(null));
    fetch.once(JSON.stringify(location1));
    fetch.mockResponse(JSON.stringify([]));
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
          <EditLocationUnit {...props} />
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
