import { mount, shallow } from 'enzyme';
import { NewLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import * as notifications from '@opensrp/notifications';
import { createBrowserHistory } from 'history';
import { RouteComponentProps, Router } from 'react-router';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fhirCient from 'fhirclient';
import { authenticateUser } from '@onaio/session-reducer';
import { location1 } from '../../LocationForm/tests/fixtures';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import { fhirHierarchy } from '../../LocationUnitList/tests/fixtures';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  it('renders correctly for create location unit', async () => {
    const queryClient = new QueryClient();
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
            <NewLocationUnit {...locationProps} />
          </QueryClientProvider>{' '}
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Add Location Unit');

    // rendered page including title
    expect(wrapper.find('h5').text()).toMatchInlineSnapshot(`"Add Location Unit"`);

    expect(wrapper.find('LocationForm').text()).toMatchSnapshot('form rendered');
    wrapper.unmount();
  });

  it('cancel button redirects to list view', async () => {
    const queryClient = new QueryClient();
    const fhir = jest.spyOn(fhirCient, 'client');
    const requestMock = jest.fn();
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: requestMock.mockResolvedValue(fhirHierarchy),
        };
      })
    );

    const cancelURL = '/admin/location/unit';

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
    wrapper.unmount();
  });

  it('handles error if fetch fails when page reloads', async () => {
    const queryClient = new QueryClient();
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
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <NewLocationUnit {...locationProps} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    expect(mockNotificationError).toHaveBeenCalledWith('');
    wrapper.unmount();
  });
});
