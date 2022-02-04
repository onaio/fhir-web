import { EditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { createdLocation1 } from '../../LocationForm/tests/fixtures';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType } from '../../LocationForm/CustomTreeSelect';
import { render, waitForElementToBeRemoved, screen, cleanup } from '@testing-library/react';

const history = createMemoryHistory();

nock.disableNetConnect();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const path = '/locations/edit';
const locationId = 'someId';
const props = {
  history,
  fhirBaseURL: 'https://r4.smarthealthit.org/',
  fhirRootLocationIdentifier: 'rootId',
  location: {
    hash: '',
    pathname: `${'/locations/edit/'}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { id: locationId },
    path: `${path}`,
    url: `${path}/${locationId}`,
  },
};

describe('EditLocationUnit', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const AppWrapper = (props: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
        </Router>
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
    cleanup();
  });

  it('renders correctly', async () => {
    const scope = nock(props.fhirBaseURL)
      .get('/Location/someId')
      .reply(200, createdLocation1)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: props.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy);

    const div = document.createElement('div');
    document.body.appendChild(div);

    render(
      <AppWrapper>
        <EditLocationUnit {...props} />
      </AppWrapper>,
      {
        container: div,
      }
    );

    // loading page
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    // title
    expect(document.querySelector('title')).toMatchInlineSnapshot(`
      <title>
        Edit &gt; area51
      </title>
    `);

    expect(screen.getByText('Edit > area51')).toBeInTheDocument();

    expect(screen.queryAllByDisplayValue('area51')).toMatchSnapshot('name value');
    expect(screen.queryAllByDisplayValue('creepTown')).toMatchSnapshot('alias value');

    scope.done();
  });

  it('renders errorPage correctly', async () => {
    nock(props.fhirBaseURL)
      .get(() => true)
      .replyWithError('A Problem happened');

    render(
      <AppWrapper>
        <EditLocationUnit {...props} />
      </AppWrapper>
    );

    // // loading page
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('renders resource404 when location is not found', async () => {
    nock(props.fhirBaseURL)
      .get(() => true)
      .reply(200, null)
      .persist();

    render(
      <AppWrapper>
        <EditLocationUnit {...props} />
      </AppWrapper>
    );

    // loading page
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/the resource you requested for, does not exist/)).toBeInTheDocument();
  });
});
