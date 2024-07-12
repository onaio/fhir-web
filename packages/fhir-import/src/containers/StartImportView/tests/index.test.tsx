import React from 'react';
import { StartDataImport } from '..';
import nock from 'nock';
import { render, cleanup, screen } from '@testing-library/react';
import * as reactQuery from 'react-query';


const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: 0,
        },
    },
});

beforeAll(() => {
    nock.disableNetConnect();
});

afterAll(() => {
    nock.enableNetConnect();
});

afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
});

test("renders correctly", async () => {

    render(<QueryClientProvider client={queryClient}>
        <StartDataImport />
    </QueryClientProvider>
    )
    const formInstruction = screen.getByTestId('form-instructions');
    expect(formInstruction.textContent).toMatchSnapshot("textContent");


})

