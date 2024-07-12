import React from 'react';
import { authenticateUser } from '@onaio/session-reducer';
import { ImporterFormInstructions } from '../formInstructions';
import nock from 'nock';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { store } from '@opensrp/store';
import * as constants from '../../../constants';
import * as reactUtils from '@opensrp/react-utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('../../../constants', () => {
    return {
        __esModule: true,
        ...Object.assign({}, jest.requireActual('../../../constants')),
        IMPORT_DOMAIN_URI: 'http://localhost',
    };
});

jest.mock('@opensrp/notifications', () => ({
    __esModule: true,
    ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));


jest.mock('@opensrp/react-utils', () => ({
    __esModule: true,
    ...Object.assign({}, jest.requireActual('@opensrp/react-utils')),
}));

beforeAll(() => {
    nock.disableNetConnect();
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

afterAll(() => {
    nock.enableNetConnect();
});

afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
});

const templateZipped = new File([''], 'templates.zip', { type: 'application/zip' });

test('renders correctly', async () => {
    nock(constants.IMPORT_DOMAIN_URI).get('/$import/templates').reply(200, templateZipped, {
        "content-type": "application/zip"
    }).persist();

    const downloadFileSpy = jest.spyOn(reactUtils, "downloadFile").mockImplementation(() => { })

    render(
        <ImporterFormInstructions />
    );

    const formInstruction = screen.getByTestId('form-instructions');
    expect(formInstruction.textContent).toMatchSnapshot("textContent");

    // template download
    const downloadTemplateBtn = screen.getByRole('button', {
        name: /Download Template/i,
    });
    fireEvent.click(downloadTemplateBtn);

    await waitFor(() => {
        expect(downloadFileSpy.mock.calls[0][1]).toEqual("import-template")
    });

    expect(nock.isDone()).toBeTruthy();
});
