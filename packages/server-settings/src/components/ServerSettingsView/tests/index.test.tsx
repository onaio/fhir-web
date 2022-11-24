import { createBrowserHistory } from 'history';
import React from 'react';
import { shallow, mount } from 'enzyme';
import * as notifications from '@opensrp/notifications';
import { ServerSettingsView } from '..';
import {
  serverSettings,
  serverSettingsLevel1,
  securityAuthenticateEndpoint,
  locationHierarchyWithoutParent,
  locationHierarchyWithParent,
  serverSettingsSimilarToParent,
} from './fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import toJson from 'enzyme-to-json';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { authenticateUser } from '@onaio/session-reducer';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('activate mission', () => {
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

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', async () => {
    const queryClient = new QueryClient();

    fetch.mockResponseOnce(JSON.stringify(securityAuthenticateEndpoint));
    fetch.mockResponseOnce(JSON.stringify(serverSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/security/authenticate',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
    ]);

    expect(wrapper.find('Tree')).toBeTruthy();
    expect(wrapper.find('Tree').at(0).text()).toMatchInlineSnapshot(`"Uganda"`);
    expect(wrapper.find('Table')).toBeTruthy();
    expect(wrapper.find('Table').at(0).text()).toMatchInlineSnapshot(
      `"NameDescriptionSettingsInherited fromActionsAnaemia prevalence 20% or lowerThe proportion of pregnant women in the population with anaemia (haemoglobin level less than 11 g/dl) is 20% or lower.Yes-Anaemia prevalence 40% or higherThe proportion of pregnant women in the population with anaemia (haemoglobin level less than 11 g/dl) is 40% or higher.No-HIV incidence greater than 3 per 100 person-years in the absence of PrEPWomen in the population have a substantial risk of HIV infection. Substantial risk of HIV infection is provisionally defined as HIV incidence greater than 3 per 100 person–years in the absence of pre-exposure prophylaxis (PrEP).No-HIV prevalence 5% or higherThe HIV prevalence in pregnant women in the population is 5% or higher.No-Hep B prevalence is intermediate (2% or higher) or high (5% or higher)The proportion of Hepatitis B surface antigen (HBsAg) seroprevalance in the general population is 2% or higher.No-Hep C prevalence is intermediate (2% or higher) or high (5% or higher)The proportion of Hepatitis C virus (HCV) antibody seroprevalence in the general population is 2% or higher. No-Low dietary calcium intakeWomen in the population are likely to have low dietary calcium intake (less than 900 mg of calcium per day).Yes-Malaria-endemic settingThis is a malaria-endemic setting.Yes-National Hep B ANC routine screening program establishedThere is a national Hepatitis B ANC routine screening program in place.Yes-Soil-transmitted helminth infection prevalence 20% or higherThe percentage of individuals in the general population infected with at least one species of soil-transmitted helminth is 20% or higher.No-12"`
    );
    wrapper.unmount();
  });

  it('Updates settings correctly when value is yes', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    fetch.mockResponseOnce(JSON.stringify(securityAuthenticateEndpoint));
    fetch.mockResponseOnce(JSON.stringify(serverSettings));
    fetch.mockResponseOnce(JSON.stringify(locationHierarchyWithoutParent));
    fetch.mockResponseOnce(JSON.stringify({}));
    fetch.mockResponseOnce(JSON.stringify(serverSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const dropdown = wrapper.find('Dropdown').at(0);
    dropdown.simulate('click');
    const subMenu = shallow(<div>{dropdown.prop('overlay')}</div>);
    const yesBtn = subMenu.find('MenuItem').at(0);

    // click yes button
    yesBtn.simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls.map((call) => [call[0], call[1]?.method])).toEqual([
      ['https://opensrp-stage.smartregister.org/opensrp/security/authenticate', 'GET'],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        'GET',
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/heirarchy/ancestors/02ebbc84-5e29-4cd5-9b79-c594058923e9',
        'GET',
      ],
      ['https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/5', 'PUT'],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        'GET',
      ],
    ]);
    wrapper.unmount();
  });

  it('Updates settings correctly when value is no - and similar to parent settings', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    fetch.mockResponseOnce(JSON.stringify(securityAuthenticateEndpoint));
    fetch.mockResponseOnce(JSON.stringify(serverSettingsSimilarToParent));
    fetch.mockResponseOnce(JSON.stringify(locationHierarchyWithParent));
    fetch.mockResponseOnce(JSON.stringify(serverSettingsSimilarToParent));
    fetch.mockResponseOnce(JSON.stringify({}));
    fetch.mockResponseOnce(JSON.stringify(serverSettingsSimilarToParent));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const dropdown = wrapper.find('Dropdown').at(0);
    dropdown.simulate('click');
    const subMenu = shallow(<div>{dropdown.prop('overlay')}</div>);
    const yesBtn = subMenu.find('MenuItem').at(1);

    // click yes button
    yesBtn.simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls.map((call) => [call[0], call[1]?.method])).toEqual([
      ['https://opensrp-stage.smartregister.org/opensrp/security/authenticate', 'GET'],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        'GET',
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/heirarchy/ancestors/02ebbc84-5e29-4cd5-9b79-c594058923e9',
        'GET',
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=b652b2f4-a95d-489b-9e28-4629746db96a&resolve=true&serverVersion=0',
        'GET',
      ],
      ['https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/5', 'DELETE'],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        'GET',
      ],
    ]);
    wrapper.unmount();
  });

  it('Updates settings correctly when value is inherited', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    fetch.mockResponseOnce(JSON.stringify(securityAuthenticateEndpoint));
    fetch.mockResponseOnce(JSON.stringify(serverSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const dropdown = wrapper.find('Dropdown').at(0);
    dropdown.simulate('click');
    const subMenu = shallow(<div>{dropdown.prop('overlay')}</div>);
    const yesBtn = subMenu.find('MenuItem').at(2);

    // click yes button
    yesBtn.simulate('click');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/security/authenticate',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/5',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('Table Changes on Tree Click', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    fetch.once(JSON.stringify(securityAuthenticateEndpoint));
    fetch.mockResponse(JSON.stringify(serverSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    await act(async () => {
      let treeholder = wrapper.find('div[className*="ant-tree-list-holder-inner"]');
      const firstNodeSwitcher = treeholder.find('span[className*="ant-tree-switcher"]').first();
      firstNodeSwitcher.simulate('click');
      await flushPromises();
      treeholder = wrapper.find('div[className*="ant-tree-list-holder-inner"]');
    });
    wrapper.update();

    await act(async () => {
      let treeholder = wrapper.find('div[className*="ant-tree-list-holder-inner"]');
      const secondNodeContent = treeholder.find('span[className*="ant-tree-title"]').last();
      secondNodeContent.simulate('click');
      treeholder = wrapper.find('div[className*="ant-tree-list-holder-inner"]');
    });
    wrapper.update();

    fetch.mockResponse(JSON.stringify(serverSettingsLevel1));

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // test snapshot of expanded tree
    expect(wrapper.find('Tree').at(0).text()).toMatchInlineSnapshot(`"UgandaKampalaKCCA"`);
    wrapper.unmount();
  });

  it('handles errors', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    fetch.mockRejectOnce(new Error('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <ServerSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');

    // broken page as well
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
  });
});
