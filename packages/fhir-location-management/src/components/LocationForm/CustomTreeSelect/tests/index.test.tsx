import { CustomTreeSelect, locationHierarchyResourceType } from '..';
import React, { ReactNode } from 'react';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import nock from 'nock';
import { fhirHierarchy } from '../../../../ducks/tests/fixtures';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

nock.disableNetConnect();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('FormComponents/CustomTreeSelect', () => {
  const props = {
    baseUrl: 'http://test.server.org',
    fhirRootLocationIdentifier: 'someId',
    placeholder: 'select',
    disabledTreeNodesCallback: () => false,
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const AppWrapper = (props: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Form>{props.children}</Form>
      </QueryClientProvider>
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('works correctly', async () => {
    const scope = nock(props.baseUrl)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: 'someId' })
      .reply(200, fhirHierarchy)
      .persist();

    const fullNodeCallback = jest.fn();

    render(
      <AppWrapper>
        <CustomTreeSelect fullDataCallback={fullNodeCallback} {...props} />
      </AppWrapper>
    );

    await waitFor(() => {
      expect(document.querySelector('.ant-select-arrow')).not.toHaveClass(
        'ant-select-arrow-loading'
      );
    });
    expect(screen.getByText(/select/)).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    expect(input).toMatchSnapshot('tree select combobox');

    fireEvent.mouseDown(input);

    expect(screen.getByTitle(/Ona Office Sub Location/)).toMatchSnapshot('root location');
    fireEvent.click(document.querySelector('.ant-select-tree-switcher_close'));

    fireEvent.click(screen.getByText(/Part Of Sub Location/));

    expect(document.querySelector('.ant-select-selection-item')).toMatchSnapshot('selected option');
    scope.done();
  });

  it('sends an error notification', async () => {
    const errorMessage = 'coughid';
    const scope = nock(props.baseUrl)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: 'someId' })
      .replyWithError(errorMessage)
      .persist();

    const errorMock = jest.spyOn(notifications, 'sendErrorNotification');

    render(
      <AppWrapper>
        <CustomTreeSelect {...props} />
      </AppWrapper>
    );

    await waitFor(() => {
      expect(document.querySelector('.ant-select-arrow')).not.toHaveClass(
        'ant-select-arrow-loading'
      );
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(
      'request to http://test.server.org/LocationHierarchy/_search?identifier=someId failed, reason: coughid'
    );
    scope.done();
  });
});
