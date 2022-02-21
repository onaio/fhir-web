import { mount } from 'enzyme';
import { ServicePointsAdd } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { INVENTORY_ADD_SERVICE_POINT } from '../../../constants';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { RouteComponentProps, Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import { commonHiddenFields } from '../../../helpers/utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import { baseLocationUnits, rawHierarchy } from '../../EditServicePoint/tests/fixtures';
import flushPromises from 'flush-promises';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  it('passes the correct values to form', async () => {
    const queryClient = new QueryClient();
    fetch.once(JSON.stringify(baseLocationUnits));
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
        params: {},
        path: `${INVENTORY_ADD_SERVICE_POINT}`,
        url: `${INVENTORY_ADD_SERVICE_POINT}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServicePointsAdd {...props} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    const locationFormProps = wrapper.find('LocationForm').props();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues = (locationFormProps as any).initialValues;

    expect(locationFormProps.hidden).toEqual(commonHiddenFields);
    expect(initialValues.instance).toEqual('eusm');
    expect(initialValues.type).toEqual('Feature');
    expect(locationFormProps.disabled).toEqual(['isJurisdiction']);

    // test re-direction url on chancel
    wrapper.find('button#location-form-cancel-button').simulate('click');
    wrapper.update();

    expect(
      (wrapper.find('Router').props() as RouteComponentProps).history.location.pathname
    ).toEqual('/inventory');
  });
});
