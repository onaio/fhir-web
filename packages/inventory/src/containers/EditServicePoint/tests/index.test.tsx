import { mount } from 'enzyme';
import { ServicePointEdit } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { INVENTORY_ADD_SERVICE_POINT } from '../../../constants';
import { baseLocationUnits, location1, rawHierarchy } from './fixtures';
import { Provider } from 'react-redux';
import { RouteComponentProps, Router } from 'react-router';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import { commonHiddenFields } from '../../../helpers/utils';
import { QueryClient, QueryClientProvider } from 'react-query';

const history = createBrowserHistory();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('CreateServicePoint', () => {
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

  it('passes the correct values to form', async () => {
    const queryClient = new QueryClient();
    fetch.mockResponseOnce(JSON.stringify(location1));
    fetch.mockResponseOnce(JSON.stringify(null));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const props = {
      history,
      location: {
        hash: '',
        pathname: `${INVENTORY_ADD_SERVICE_POINT}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { id: location1.id },
        path: `${INVENTORY_ADD_SERVICE_POINT}`,
        url: `${INVENTORY_ADD_SERVICE_POINT}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServicePointEdit {...props} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const locationFormProps = wrapper.find('LocationForm').props();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues = (locationFormProps as any).initialValues;

    expect(locationFormProps.hidden).toEqual(commonHiddenFields);
    expect(initialValues.instance).toEqual('eusm');
    expect(locationFormProps.disabled).toEqual(['isJurisdiction', 'parentId']);

    // test re-direction url on chancel
    wrapper.find('button#location-form-cancel-button').simulate('click');
    wrapper.update();

    expect(
      (wrapper.find('Router').props() as RouteComponentProps).history.location.pathname
    ).toEqual('/inventory/profile/b652b2f4-a95d-489b-9e28-4629746db96a');
  });
});
