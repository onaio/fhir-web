import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedPatientDetails } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import * as reactQuery from 'react-query';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import * as fhirCient from 'fhirclient';
import toJson from 'enzyme-to-json';
import { patientDetails } from './fixtures';
import { DocumentReferenceDetails } from '../../DocumentReference';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

describe('Patients list view', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders patients table without crashing', async () => {
    shallow(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <ConnectedPatientDetails fhirBaseURL="https://r4.smarthealthit.org/" />
        </QueryClientProvider>
      </Router>
    );
  });

  it('renders correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(patientDetails),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ConnectedPatientDetails fhirBaseURL="https://r4.smarthealthit.org/" />
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
    expect(wrapper.text()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('shows broken page if fhir api is down', async () => {
    const reactQueryMock = jest.spyOn(reactQuery, 'useQuery');
    reactQueryMock.mockImplementation(
      () =>
        ({
          data: undefined,
          error: 'Something went wrong',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ConnectedPatientDetails fhirBaseURL="https://r4.smarthealthit.org/" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorAn error occuredGo backGo home"`);
    wrapper.unmount();
  });

  it('shows document Reference', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(patientDetails),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ConnectedPatientDetails fhirBaseURL="https://r4.smarthealthit.org/" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(wrapper.find(DocumentReferenceDetails)).toHaveLength(0);
    // click on documentReference button
    const docReferenceBtn = wrapper.find('#DocumentReference').first();
    docReferenceBtn.simulate('click');
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(wrapper.find(DocumentReferenceDetails)).toHaveLength(1);
    wrapper.unmount();
  });

  it('shows immunization recommendation', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValueOnce(patientDetails),
        };
      })
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ConnectedPatientDetails fhirBaseURL="https://r4.smarthealthit.org/" />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // click on immunizationRecommendation button
    const docReferenceBtn = wrapper.find('#ImmunizationRecommendation').first();
    docReferenceBtn.simulate('click');
    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(wrapper.find('Table').first().text()).toMatchSnapshot(
      'ImmunizationRecommendation records'
    );
    wrapper.unmount();
  });
});
