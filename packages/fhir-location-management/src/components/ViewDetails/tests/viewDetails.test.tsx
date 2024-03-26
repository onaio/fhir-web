import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { locationResourceType } from '@opensrp/fhir-helpers';
import userEvent from '@testing-library/user-event';
import { centralProvinceInclude, rootFhirLocationInclude } from './fixtures';
import { centralProvinceLoc } from './fixtures';
import { ViewDetails } from '..';
import { createMemoryHistory } from 'history';
import { setConfig } from '@opensrp/pkg-config';
import { Switch, Route } from 'react-router';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

setConfig('projectCode', 'eusm');
jest.setTimeout(10000);
nock.disableNetConnect();

const props = {
  fhirBaseURL: 'http://test.server.org',
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={`/view/:id`}>
            <ViewDetails {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
    )
  );
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`view/${centralProvinceLoc.id}`);

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _id: centralProvinceInclude.entry[0].resource.id, _include: 'Location:partof' })
    .reply(200, centralProvinceInclude);

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _id: rootFhirLocationInclude.entry[0].resource.id, _include: 'Location:partof' })
    .reply(200, rootFhirLocationInclude);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // pageTitle - confirm page has loaded.
  await waitFor(() => {
    screen.getByText(/View details | Central ProvincegeByText/i);
  });
  // path breadcrumb
  const navLinks = document.querySelectorAll('nav ol li');
  for (const link of navLinks) {
    expect(link).toMatchSnapshot('breadcrumb path link');
  }

  // location details
  const detailSection = document.querySelector('[data-testid="details-section"]');
  expect(detailSection?.textContent).toEqual(
    'Central ProvinceEdit detailsID: d9d7aa7b-7488-48e7-bae8-d8ac5bd09334Version: 1Date Last Updated12/1/2023, 7:44:56 AMLocation NameCentral ProvinceStatusactivealiasLatitude & LongitudePhysical TypeJurisdictionGeometryDescription'
  );

  // details tab is shown
  screen.getByTestId('details-tab');

  // edit location
  const editLocationBtn = screen.getByText(/Edit details/i);
  userEvent.click(editLocationBtn);
  expect(history.location.pathname).toEqual(
    '/admin/location/unit/edit/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334'
  );

  expect(nock.isDone()).toBeTruthy();
});
