import React from 'react';
import {
  INVENTORY_BULK_UPLOAD_URL,
  OPENSRP_IMPORT_STOCK_ENDPOINT,
  OPENSRP_UPLOAD_STOCK_ENDPOINT,
} from '../../../constants';
import { mount } from 'enzyme';
import { BulkUpload } from '..';
import nock from 'nock';
import { MemoryRouter, Route, RouteComponentProps } from 'react-router';
import { act } from 'react-dom/test-utils';

jest.mock('@opensrp/react-utils', () => {
  const actual = jest.requireActual('@opensrp/react-utils');
  return {
    ...actual,
    handleSessionOrTokenExpiry: () => Promise.resolve('Token'),
  };
});

describe('Inventory bulk upload.integrationTest', () => {
  it('uploading file works for file without error', async () => {
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
    nock(baseURL).post(`/${OPENSRP_IMPORT_STOCK_ENDPOINT}`).reply(200, sampleResponse);

    const wrapper = mount(
      <MemoryRouter initialEntries={[INVENTORY_BULK_UPLOAD_URL]}>
        <Route
          path={INVENTORY_BULK_UPLOAD_URL}
          render={(props) => {
            return <BulkUpload {...props} baseURL={baseURL} />;
          }}
        ></Route>
      </MemoryRouter>,
      { attachTo: div }
    );
    // start upload page
    expect(wrapper.text()).toMatchSnapshot('start upload page');

    // simulate upload
    await act(async () => {
      const file = new File([''], 'file.csv');
      wrapper.find('input[type="file"]').simulate('change', { target: { files: [file] } });
      wrapper.update();
    });

    // should have a loading page
    expect(wrapper.text()).toMatchSnapshot('uploading card');
    expect(wrapper.find('StartUpload')).toHaveLength(1);
    wrapper.update();

    expect((wrapper.find('Router').props() as RouteComponentProps).history.location.search).toEqual(
      '?bulkStep=preConfirmationUpload'
    );

    // TODO : not sure why the rest of the flow here is so volatile, need to check how to make the test
    // more deterministic in how the data flows and thus predictable card re-renders.
  });
});
