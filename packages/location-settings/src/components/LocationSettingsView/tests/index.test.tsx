import { createBrowserHistory } from 'history';
import React from 'react';
import { shallow, mount } from 'enzyme';
import * as notifications from '@opensrp/notifications';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { LocationSettingsView } from '..';
import {
  locationSettings,
  locationSettingslevel1,
  securityauthenticateendpoint,
  tree,
} from './fixtures';
import { Setting } from '../../../ducks/settings';
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', async () => {
    const queryClient = new QueryClient();

    fetch.mockResponseOnce(JSON.stringify(securityauthenticateendpoint));
    fetch.mockResponseOnce(JSON.stringify(locationSettings));
    fetch.mockResponseOnce(JSON.stringify(locationSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/security/authenticate",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);

    expect(wrapper.find('Tree')).toBeTruthy();
    expect(wrapper.find('Table')).toBeTruthy();
  });

  it('Table Changes on Tree Click', async () => {
    const queryClient = new QueryClient();

    fetch.mockResponseOnce(JSON.stringify(securityauthenticateendpoint));
    fetch.mockResponseOnce(JSON.stringify(locationSettings));
    fetch.mockResponseOnce(JSON.stringify(locationSettings));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationSettingsView
              baseURL="https://opensrp-stage.smartregister.org/opensrp/"
              restBaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/"
              v2BaseURL="https://opensrp-stage.smartregister.org/opensrp/rest/v2/"
            />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    await act(async () => {
      let treeholder = wrapper.find('div[className*="ant-tree-list-holder-inner"]');
      const firstNodeSwitcher = treeholder.find('span[className*="ant-tree-switcher"]').first();
      firstNodeSwitcher.simulate('click');
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

    fetch.mockResponseOnce(JSON.stringify(locationSettings));
    fetch.mockResponseOnce(JSON.stringify(locationSettingslevel1));

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/security/authenticate",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/security/authenticate",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=02ebbc84-5e29-4cd5-9b79-c594058923e9&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings?identifier=population_characteristics&locationId=8340315f-48e4-4768-a1ce-414532b4c49b&resolve=true&serverVersion=0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer sometoken",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
