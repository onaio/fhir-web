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

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    await new Promise((resolve) => setImmediate(resolve));
    wrapper.update();
    // // should be at the success pre confirmation  page
    expect((wrapper.find('Router').props() as RouteComponentProps).history.location.search).toEqual(
      '?bulkStep=preConfirmationSuccess'
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('pre success confirmation card');
    expect(wrapper.find('PreConfirmationSuccess')).toHaveLength(1);

    // simulate confirmation on pre confirmation success page
    const confirmButton = wrapper.find('#confirm-commit').first();
    expect(confirmButton.text()).toMatchInlineSnapshot(`"Proceed with adding inventory"`);

    confirmButton.simulate('click');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('post success confirmation card');
    wrapper.unmount();
  });
});
