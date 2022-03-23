import { render, waitForElementToBeRemoved, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LocationUnitDetail } from '..';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

nock.disableNetConnect();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirBaseUrl: 'http://test.server.org',
  detailId: 'someId',
};

describe('location-management/src/components/LocationUnitDetail', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const AppWrapper = (props: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
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
    cleanup();
    nock.cleanAll();
  });

  it('responds to errors', async () => {
    const scope = nock(props.fhirBaseUrl)
      .get('/Location/someId')
      .replyWithError('Feria')
      .get('/Location/empty')
      .reply(200, null);

    const closeMock = jest.fn();
    const { rerender } = render(
      <AppWrapper>
        <LocationUnitDetail onClose={closeMock} {...props}></LocationUnitDetail>
      </AppWrapper>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByTestId('error-alert')).toBeInTheDocument();

    rerender(
      <AppWrapper>
        <LocationUnitDetail onClose={closeMock} {...props} detailId={'empty'}></LocationUnitDetail>
      </AppWrapper>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByTestId('info-alert')).toBeInTheDocument();
    scope.done();
  });
});
