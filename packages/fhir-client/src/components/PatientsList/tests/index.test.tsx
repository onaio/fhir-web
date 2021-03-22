import React from 'react';
import { Provider } from 'react-redux';
import { PatientsList } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import { QueryClient, QueryClientProvider } from 'react-query';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { QueryCache } from 'react-query';
import { patients } from './fixtures';
import { mount, shallow } from 'enzyme';
import * as fhirCient from 'fhirclient';
import toJson from 'enzyme-to-json';

const queryClient = new QueryClient();
const queryCache = new QueryCache();

jest.mock('fhirclient', () => ({
  client: jest.fn().mockImplementation(() => {
    return {
      request: jest.fn(),
    };
  }),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

describe('Patients list view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    queryCache.clear();
    queryClient.clear();
  });

  afterEach(async () => {
    await new Promise((resolve) => setImmediate(resolve));
    jest.clearAllMocks();
    jest.resetAllMocks();
    queryCache.clear();
    queryClient.clear();
  });

  it('renders patients table without crashing', async () => {
    shallow(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <PatientsList />
        </QueryClientProvider>
      </Router>
    );
  });

  it('renders correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(patients),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <PatientsList />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();
    fhir.mockReset();
    wrapper.unmount();
  });

  it('shows broken page if fhir api is down', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('Error'),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <PatientsList />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
  });
});
