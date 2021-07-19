/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import TeamsAddEdit from '..';
import {
  team,
  practitioner102,
  practitioner116,
  practitionerrole,
  teamsdetail,
  practitioner,
  team212,
} from '../../../tests/fixtures';
import * as fhirCient from 'fhirclient';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');
fhir.mockImplementation(
  jest.fn().mockImplementation(() => {
    return {
      request: jest.fn((url) => {
        if (url === 'Organization/') return Promise.resolve(team);
        if (url === 'Organization/212') return Promise.resolve(team212);
        else if (url === 'Practitioner/') return Promise.resolve(practitioner);
        else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
        else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
        else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
        else {
          console.error(url);
        }
      }),
    };
  })
);

describe('components/TeamsAddEdit', () => {
  it('renders correctly when creating Team', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsAddEdit fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders correctly when Editting Team', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/212`, hash: '', search: '', state: {} }]}>
        <QueryClientProvider client={queryClient}>
          <Route path="/:id" fhirBaseURL={fhirBaseURL} component={TeamsAddEdit} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });
});
