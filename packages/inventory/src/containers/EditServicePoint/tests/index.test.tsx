import { mount } from 'enzyme';
import { ServicePointEdit } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { INVENTORY_ADD_SERVICE_POINT } from '../../../constants';
import { location1 } from './fixtures';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import { commonHiddenFields } from '../../../helpers/utils';

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
    fetch.once(JSON.stringify(null));
    fetch.once(JSON.stringify(location1));
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
        params: { id: location1.id },
        path: `${INVENTORY_ADD_SERVICE_POINT}`,
        url: `${INVENTORY_ADD_SERVICE_POINT}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointEdit {...props} />
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
    expect(locationFormProps.disabled).toEqual(['isJurisdiction']);
  });
});
