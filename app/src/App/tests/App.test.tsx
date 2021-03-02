import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, RouteComponentProps, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import App, {
  PrivateComponent,
  PublicComponent,
  CallbackComponent,
  LoadingComponent,
  SuccessfulLoginComponent,
} from '../App';
import { expressAPIResponse } from './fixtures';
import { UserList } from '@opensrp/user-management';
import { KEYCLOAK_API_BASE_URL } from '../../configs/env';
import NotFound from '../../components/NotFound';
import { mount } from 'enzyme';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';

jest.mock('../../configs/env');

const realLocation = window.location;

// tslint:disable-next-line: no-var-requires

describe('App - unauthenticated', () => {
  beforeEach(() => {
    window.location = realLocation;
    fetch.mockResponse(JSON.stringify(expressAPIResponse));
    // Reset history
    history.push('/');
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('integration: renders App correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(`"AdminLogin"`);

    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // after resolving get oauth state request superset user is logged in
    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/login',
      },
    });
    wrapper.unmount();
  });

  it('PublicComponent Renders correctly', () => {
    const MockComponent = () => {
      return <NotFound />;
    };
    const props = { exact: true, path: '/unknown', authenticated: false };
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/unknown`, hash: '', search: '', state: {} }]}>
        <PublicComponent {...props} component={MockComponent} />
      </MemoryRouter>
    );

    expect(wrapper.exists(MockComponent)).toBeTruthy();
    wrapper.unmount();
  });

  it('Callback component Renders correctly', async () => {
    const routeProps: RouteComponentProps<{ id: string }> = {
      history,
      location: {
        hash: '',
        pathname: '/',
        search: '?next=%2F',
        state: {},
      },
      match: {
        params: { id: 'OpenSRP' },
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <CallbackComponent {...routeProps} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('CallbackComponent')).toBeTruthy();
    wrapper.unmount();
  });

  it('Loading component Renders correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <LoadingComponent />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('LoadingComponent')).toBeTruthy();
    wrapper.unmount();
  });

  it('Successful Login component Renders correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <SuccessfulLoginComponent />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('SuccessfulLoginComponent')).toBeTruthy();
    wrapper.unmount();
  });
});

describe('App - authenticated', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'test@gmail.com',
          name: 'This Name',
          username: 'tHat Part',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
  });

  beforeEach(() => {
    window.location = realLocation;
    // Reset history
    history.push('/');
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('integration: renders App correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"InventoryAdmintHat ParttHat PartWelcome to OpenSRP"`
    );

    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // after resolving get oauth state request superset user is logged in
    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/',
      },
    });
    wrapper.unmount();
  });

  it('PrivateComponent Renders correctly', async () => {
    const MockComponent = (props: any) => {
      return <UserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />;
    };
    const props = {
      exact: true,
      redirectPath: '/login',
      disableLoginProtection: false,
      path: '/admin',
      authenticated: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <PrivateComponent
            {...props}
            component={MockComponent}
            activeRoles={['ROLE_VIEW_KEYCLOAK_USERS']}
          />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    expect(wrapper.exists(MockComponent)).toBeTruthy();
    wrapper.unmount();
  });

  it('Show Unauthorized Page if role doesnt have sufficient permissions', async () => {
    const MockComponent = (props: any) => {
      return <UserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />;
    };
    const props = {
      exact: true,
      redirectPath: '/login',
      disableLoginProtection: false,
      path: '/admin',
      authenticated: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <PrivateComponent {...props} component={MockComponent} activeRoles={['unauthorized']} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    expect(wrapper.exists(MockComponent)).toBeFalsy();
    // test if UnauthorizedPage is rendered
    expect(wrapper.find('UnauthorizedPage').text()).toMatchInlineSnapshot(
      `"ErrorSorry, you are not authorized to access this pageGo backGo home"`
    );
    expect(toJson(wrapper.find('UnauthorizedPage'))).toBeTruthy();
    wrapper.unmount();
  });
});
