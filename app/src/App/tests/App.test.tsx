import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, RouteComponentProps, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import App, { CallbackComponent, LoadingComponent, SuccessfulLoginComponent } from '../App';
import { expressAPIResponse } from './fixtures';
import { mount } from 'enzyme';
import { authenticateUser } from '@onaio/session-reducer';
import * as serverLogout from '@opensrp/server-logout';
import {
  CATALOGUE_CREATE_VIEW_URL,
  CATALOGUE_EDIT_VIEW_URL,
  CATALOGUE_LIST_VIEW_URL,
  ConnectedProductCatalogueList,
  CreateProductView,
  EditProductView,
} from '@opensrp/product-catalogue';

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

  it('correctly logs out user', async () => {
    const mock = jest.spyOn(serverLogout, 'logout');
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/logout` }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    expect(mock).toHaveBeenCalled();
  });

  it('product catalogue routes are correctly registered', async () => {
    // redirecting to certain routes renders the correct page
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `${CATALOGUE_LIST_VIEW_URL}` }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // start with the catalogue list component
    expect(wrapper.find(ConnectedProductCatalogueList)).toHaveLength(1);

    // go to the product profile view
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${CATALOGUE_LIST_VIEW_URL}/1`
    );
    wrapper.update();
    expect(wrapper.find('ViewDetails')).toHaveLength(1);

    // go to new product page
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${CATALOGUE_CREATE_VIEW_URL}`
    );

    wrapper.update();
    expect(wrapper.find(CreateProductView)).toHaveLength(1);

    // go to edit product page
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${CATALOGUE_EDIT_VIEW_URL}/1`
    );
    wrapper.update();
    expect(wrapper.find(EditProductView)).toHaveLength(1);
    wrapper.unmount();
  });
});
