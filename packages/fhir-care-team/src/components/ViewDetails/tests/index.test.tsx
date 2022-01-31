import { mount } from 'enzyme';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import * as reactQuery from 'react-query';
import { ViewDetails } from '..';
import * as fixtures from './fixtures';
import { createBrowserHistory } from 'history';
import * as fhirCient from 'fhirclient';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { createTestQueryClient } from '../../ListView/tests/utils';

const { QueryClientProvider } = reactQuery;

const testQueryClient = createTestQueryClient();

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('View Care Team Details', () => {
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
  it('works correctly', async () => {
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockResolvedValue(fixtures.careTeam1),
        };
      })
    );
    const props = {
      careTeamId: fixtures.careTeam1.id,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
    };

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <ViewDetails {...props} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('nominal display');
    // att test case to capture space element props snapshot
    expect(wrapper.find('ViewDetails Space').props()).toMatchSnapshot('space element');
    wrapper.unmount();
  });

  it('displays care team, details correctly', async () => {
    const props = {
      careTeamId: fixtures.careTeam1.id,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
    };
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <ViewDetails {...props} />
        </QueryClientProvider>
      </Router>
    );

    // check that detail view is rendered
    expect(toJson(wrapper.find('.view-details-content'))).toBeTruthy();
  });

  it('detail view without careTeamId', () => {
    const props = {
      careTeamId: '',
      fhirBaseURL: 'https://r4.smarthealthit.org/',
    };
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <ViewDetails {...props} />
        </QueryClientProvider>
      </Router>
    );
    expect(toJson(wrapper.find('.view-details-content'))).toMatchSnapshot('Should be null');
    wrapper.unmount();
  });

  it('Closes on clicking cancel (X) ', () => {
    const props = {
      careTeamId: fixtures.careTeam1.id,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
    };
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <ViewDetails {...props} />
        </QueryClientProvider>
      </Router>
    );

    // simulate clicking on close button
    act(() => {
      wrapper.find('.flex-right button').simulate('click');
    });

    expect(wrapper.props().history.location.pathname).toEqual('/admin/CareTeams');
    wrapper.unmount();
  });

  it('shows broken page if fhir api is down', async () => {
    const props = {
      careTeamId: fixtures.careTeam1.id,
      fhirBaseURL: 'https://r4.smarthealthit.org/',
    };
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
      <Router history={history}>
        <QueryClientProvider client={testQueryClient}>
          <ViewDetails {...props} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
    wrapper.unmount();
  });
});
