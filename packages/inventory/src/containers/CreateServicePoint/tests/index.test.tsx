import { mount } from 'enzyme';
import { ServicePointsAdd } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { INVENTORY_ADD_SERVICE_POINT } from '../../../constants';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  it('passes the correct values to form', async () => {
    fetch.mockResponse(JSON.stringify([]));

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
          <ServicePointsAdd {...props} />
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

    expect(locationFormProps.hidden).toEqual([
      'extraFields',
      'status',
      'type',
      'locationTags',
      'externalId',
    ]);
    expect(initialValues.instance).toEqual('eusm');
    expect(locationFormProps.disabled).toEqual(['isJurisdiction']);
  });
});
