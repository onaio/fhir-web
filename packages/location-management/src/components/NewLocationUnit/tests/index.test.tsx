import { mount, shallow } from 'enzyme';
import { NewLocationUnit } from '..';
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
import { QueryClient, QueryClientProvider } from 'react-query';
import flushPromises from 'flush-promises';
import { baseLocationUnits, rawHierarchy } from '../../LocationUnitList/tests/fixtures';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

const path = '/locations/new';
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
    params: {},
    path: `${path}`,
    url: `${path}/${locationId}`,
  },
};

describe('NewLocationUnit', () => {
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
            <NewLocationUnit {...locationProps} />
          </QueryClientProvider>{' '}
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
  });

  it('renders correctly when location is jurisdiction', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    // fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <NewLocationUnit {...locationProps} />
          </QueryClientProvider>{' '}
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/6bf9c085-350b-4bb2-990f-80dc2caafb33',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=service_point_types',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Add Location Unit');

    // rendered page including title
    expect(wrapper.find('h5').text()).toMatchInlineSnapshot(`"Add Location Unit"`);

    expect(wrapper.find('LocationForm').text()).toMatchSnapshot('form rendered');
  });

  it('cancel url is used if passed', async () => {
    const queryClient = new QueryClient();
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
            <NewLocationUnit {...props} />
          </QueryClientProvider>{' '}
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
