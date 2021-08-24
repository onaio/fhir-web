import React from 'react';
import {
  INVENTORY_BULK_UPLOAD_URL,
  OPENSRP_IMPORT_STOCK_ENDPOINT,
  OPENSRP_UPLOAD_STOCK_ENDPOINT,
} from '../../../constants';
import { BulkUpload } from '..';
import nock from 'nock';
import { MemoryRouter, Route } from 'react-router';
import lang from '../../../lang';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@opensrp-web/react-utils', () => {
  const actual = jest.requireActual('@opensrp-web/react-utils');
  return {
    ...actual,
    handleSessionOrTokenExpiry: () => Promise.resolve('Token'),
  };
});
const sampleErrorResponse =
  '"Total Number of Rows in the CSV ",3\r\n"Rows processed ",0\r\n"\n"\r\nRow Number,Reason of Failure\r\n1,"[Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number]"\r\n2,[Service point ID does not exist]\r\n3,"[Service point ID does not exist, UNICEF section is not valid, Donor is not valid]"\r\n';
const sampleGoodResponse =
  '"Total Number of Rows in the CSV ",3\r\n"Rows processed ",3\r\n"\n"\r\nRow Number,Reason of Failure\r\n';

describe('Inventory bulk upload.integrationTest', () => {
  it('uploading file works for file without error', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const sampleResponse = {
      rowCount: 5,
    };

    const div = document.createElement('div');
    document.body.append(div);

    const baseURL = 'http://localhost/';

    nock(baseURL)
      .options(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`)
      .reply(200, { 'Access-Control-Allow-Origin': '*' } as unknown);

    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(200, sampleResponse);
    nock(baseURL).post(`/${OPENSRP_IMPORT_STOCK_ENDPOINT}`).reply(200, sampleGoodResponse);

    render(
      <MemoryRouter initialEntries={[INVENTORY_BULK_UPLOAD_URL]}>
        <Route
          path={INVENTORY_BULK_UPLOAD_URL}
          render={(props) => {
            return <BulkUpload {...props} baseURL={baseURL} />;
          }}
        ></Route>
      </MemoryRouter>,
      { container }
    );

    const file = new File([''], 'file.csv');
    const uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    await waitFor(() => {
      screen.getByText('Proceed with adding inventory');
    });

    // pre confirmation success page
    const confirmCommitButton = container.querySelector('button#confirm-commit');
    fireEvent.click(confirmCommitButton);

    await waitFor(() => {
      screen.getByText('“file.csv” inventory items successfully added');
    });

    // post confirmation page
    const uploadAnotherButton = screen.queryByRole('button', { name: lang.UPLOAD_ANOTHER_FILE });
    uploadAnotherButton.click();

    // we should be back to the start upload page
    await waitFor(() => {
      screen.getByText(lang.USE_CSV_TO_UPLOAD_INVENTORY);
    });
  });

  it('faces 400 errors during initial upload', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const sampleResponse = {
      rowCount: 5,
    };

    const div = document.createElement('div');
    document.body.append(div);

    const baseURL = 'http://localhost/';

    nock(baseURL)
      .options(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`)
      .reply(200, { 'Access-Control-Allow-Origin': '*' } as unknown);

    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(400, sampleErrorResponse);
    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(200, sampleResponse);
    nock(baseURL).post(`/${OPENSRP_IMPORT_STOCK_ENDPOINT}`).reply(400, sampleErrorResponse);

    render(
      <MemoryRouter initialEntries={[INVENTORY_BULK_UPLOAD_URL]}>
        <Route
          path={INVENTORY_BULK_UPLOAD_URL}
          render={(props) => {
            return <BulkUpload {...props} baseURL={baseURL} />;
          }}
        ></Route>
      </MemoryRouter>,
      { container }
    );

    let file = new File([''], 'file.csv');
    let uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    await waitFor(() => {
      screen.getByText(lang.PLEASE_FIX_THE_ERRORS_LISTED_BELOW);
    });

    // find retry button and lick
    const retryUpload = screen.queryByRole('button', { name: lang.RETRY });
    retryUpload.click();

    // we should be back to the start upload page
    await waitFor(() => {
      screen.getByText(lang.USE_CSV_TO_UPLOAD_INVENTORY);
    });

    // retry upload successfully so we can test 400 error response during confirmation
    file = new File([''], 'file.csv');
    uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    await waitFor(() => {
      screen.getByText('Proceed with adding inventory');
    });

    const confirmCommitButton = container.querySelector('button#confirm-commit');
    fireEvent.click(confirmCommitButton);

    // error during bulk upload confirmation page
    await waitFor(() => {
      screen.getByText('Processing error: inventory items failed to be added');
    });
  });

  it('sends a notification for other types of errors', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const sampleResponse = {
      rowCount: 5,
    };

    const div = document.createElement('div');
    document.body.append(div);

    const baseURL = 'http://localhost/';

    nock(baseURL)
      .options(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`)
      .reply(200, { 'Access-Control-Allow-Origin': '*' } as unknown);

    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(500, {});
    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(200, sampleResponse);
    nock(baseURL).post(`/${OPENSRP_IMPORT_STOCK_ENDPOINT}`).reply(500, {});

    render(
      <MemoryRouter initialEntries={[INVENTORY_BULK_UPLOAD_URL]}>
        <Route
          path={INVENTORY_BULK_UPLOAD_URL}
          render={(props) => {
            return <BulkUpload {...props} baseURL={baseURL} />;
          }}
        ></Route>
      </MemoryRouter>,
      { container }
    );

    const file = new File([''], 'file.csv');
    let uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    // should have reverted back to start upload
    await waitFor(() => {
      screen.getByText(lang.USE_CSV_TO_UPLOAD_INVENTORY);
      screen.getByText('Request failed with status code 500');
    });

    uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    // confirmation Page
    await waitFor(() => {
      screen.getByText('Proceed with adding inventory');
    });

    // // now confirm, after which we get another error

    // pre confirmation success page
    const confirmCommitButton = container.querySelector('button#confirm-commit');
    fireEvent.click(confirmCommitButton);

    // error during bulk
    await waitFor(() => {
      screen.getByText('Use a CSV file to add service point inventory');
      screen.getAllByText('Request failed with status code 500');
    });
  });
  it('test cancel on pre confirmation', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const sampleResponse = {
      rowCount: 5,
    };

    const div = document.createElement('div');
    document.body.append(div);

    const baseURL = 'http://localhost/';

    nock(baseURL)
      .options(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`)
      .reply(200, { 'Access-Control-Allow-Origin': '*' } as unknown);

    nock(baseURL).post(`/${OPENSRP_UPLOAD_STOCK_ENDPOINT}`).reply(200, sampleResponse);
    nock(baseURL).post(`/${OPENSRP_IMPORT_STOCK_ENDPOINT}`).reply(200, sampleGoodResponse);

    render(
      <MemoryRouter initialEntries={[INVENTORY_BULK_UPLOAD_URL]}>
        <Route
          path={INVENTORY_BULK_UPLOAD_URL}
          render={(props) => {
            return <BulkUpload {...props} baseURL={baseURL} />;
          }}
        ></Route>
      </MemoryRouter>,
      { container }
    );

    const file = new File([''], 'file.csv');
    const uploadFileInput = container.querySelector('input[type="file"]');
    fireEvent.change(uploadFileInput, { target: { files: [file] } });

    await waitFor(() => {
      screen.getByText('Proceed with adding inventory');
    });

    // find confirm cancel button
    const cancelCommit = container.querySelector('button#cancel-commit');
    fireEvent.click(cancelCommit);

    await waitFor(() => {
      screen.getByText(lang.USE_CSV_TO_UPLOAD_INVENTORY);
    });
  });
});
