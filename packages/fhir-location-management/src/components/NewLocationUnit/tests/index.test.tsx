import { mount } from 'enzyme';
import { NewLocationUnit } from '..';
import React, { ReactNode } from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { RouteComponentProps, Router } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

nock.disableNetConnect();

const history = createMemoryHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const path = '/locations/new';
const locationProps = {
  fhirBaseURL: 'http://test.server.org',
  fhirRootLocationIdentifier: 'someId',
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
    url: `${path}/locationId`,
  },
};

describe('NewLocationUnit', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const AppWrapper = (props: { children: ReactNode }) => {
    // TODO - do we need a redux provider
    return (
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
        </Router>
      </Provider>
    );
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  it('renders without crashing', async () => {
    const wrapper = mount(
      <AppWrapper>
        <NewLocationUnit {...locationProps} />
      </AppWrapper>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();
    expect(wrapper.text()).toMatchSnapshot('form rendered');
    wrapper.unmount();
  });

  it('cancel button redirects to list view', async () => {
    const scope = nock(locationProps.fhirBaseURL)
      .get(() => true)
      .query(() => true)
      .reply(200, {})
      .persist();

    const cancelURL = '/admin/location/unit';
    const props = {
      ...locationProps,
      cancelURLGenerator: () => cancelURL,
    };

    const wrapper = mount(
      <AppWrapper>
        <NewLocationUnit {...props} />
      </AppWrapper>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    // simulate click on cancel button
    wrapper.find('button#location-form-cancel-button').simulate('click');
    wrapper.update();

    // check url
    expect(
      (wrapper.find('Router').props() as RouteComponentProps).history.location.pathname
    ).toEqual(cancelURL);

    scope.done();
    wrapper.unmount();
  });
});
