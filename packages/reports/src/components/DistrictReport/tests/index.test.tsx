import React from 'react';
import { DistrictReport } from '../index';
import { shallow, mount } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import fetch from 'jest-fetch-mock';
import { OpenSRPService } from '@opensrp/server-service';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { authenticateUser } from '@onaio/session-reducer';

const history = createBrowserHistory();

describe('DistrictReport', () => {
  const downloadProps = {
    opensrpBaseURL: 'https://some.open.opensrp.url/opensrp/rest/',
  };

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          api_token: 'hunter2',
          oAuth2Data: { access_token: 'hunter2', state: 'abcde' },
        }
      )
    );
  });

  it('renders without crashing', () => {
    const queryClient = new QueryClient();

    const wrapper = shallow(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders correct elements', async () => {
    fetch.mockOnce(
      JSON.stringify({
        team: {
          team: {
            location: {
              display: 'Tunisia',
              name: 'Tunisia',
              uuid: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            },
          },
        },
      })
    );

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    console.log(fetch.mock.calls);
    expect(wrapper.find('Title').text()).toMatchInlineSnapshot(`"Download District Report"`);
  });
});
