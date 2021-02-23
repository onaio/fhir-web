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
          <NewLocationUnit {...locationProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  it('renders correctly when location is jurisdiction', async () => {
    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <NewLocationUnit {...locationProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Add Location Unit');

    // rendered page including title
    expect(wrapper.find('h5').text()).toMatchInlineSnapshot(`"Add Location Unit"`);

    expect(wrapper.find('LocationForm').text()).toMatchSnapshot('form rendered');
  });

  it('cancel url is used if passed', async () => {
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
          <NewLocationUnit {...props} />
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
