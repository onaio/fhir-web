import React from 'react';
import { createBrowserHistory } from 'history';
import { BULK_UPLOAD_PARAM, INVENTORY_BULK_UPLOAD_URL } from '../../../constants';
import { mount, shallow } from 'enzyme';
import { BulkUpload } from '..';
import { Helmet } from 'react-helmet';
// import axios from 'axios';
// import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
// import toJson from 'enzyme-to-json';
import { UploadStatus } from '../../../helpers/utils';

jest.mock('axios');

const history = createBrowserHistory();

const props = {
  history,
  location: {
    hash: '',
    pathname: `${INVENTORY_BULK_UPLOAD_URL}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${INVENTORY_BULK_UPLOAD_URL}`,
    url: `${INVENTORY_BULK_UPLOAD_URL}`,
  },
};

describe('Inventory bulk upload', () => {
  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <BulkUpload {...props} />
      </Router>
    );
  });
  it('renders correctly', () => {
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...props} />
      </Router>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Add inventory via CSV');

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('start upload page');

    expect(wrapper.find('StartUpload')).toHaveLength(1);
  });

  it('shows pre confirmation upload page', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.PRE_CONFIRMATION_UPLOAD}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('pre confirmation page');

    expect(wrapper.find('UploadValidateCard')).toHaveLength(1);
  });

  it('shows pre confirmation validation page', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.PRE_CONFIRMATION_VALIDATION}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('pre confirmation validation page');

    expect(wrapper.find('UploadValidateCard')).toHaveLength(1);
  });

  it('shows pre confirmation success page', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.PRE_CONFIRMATION_SUCCESS}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('pre confirmation success page');

    expect(wrapper.find('PreConfirmationSuccess')).toHaveLength(1);
  });

  it('shows pre confirmation error page', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.PRE_CONFIRMATION_ERROR}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('pre confirmation error page');

    expect(wrapper.find('PreConfirmationError')).toHaveLength(1);
  });

  it('shows post confirmation success card', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.POST_CONFIRMATION_SUCCESS}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('post confirmation success page');

    expect(wrapper.find('PostConfirmationSuccess')).toHaveLength(1);
  });

  it('shows post confirmation upload card', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.POST_CONFIRMATION_UPLOAD}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('post confirmation upload page');

    expect(wrapper.find('PostConfirmationUpload')).toHaveLength(1);
  });

  it('shows post confirmation error card', () => {
    const thisProps = {
      ...props,
      location: {
        ...props.location,
        search: `?${BULK_UPLOAD_PARAM}=${UploadStatus.POST_CONFIRMATION_ERROR}`,
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <BulkUpload {...thisProps} />
      </Router>
    );

    // start upload page
    expect(wrapper.text()).toMatchSnapshot('post confirmation error page');

    expect(wrapper.find('PostConfirmError')).toHaveLength(1);
  });

  // xit('uploading file works for file without error', async () => {
  //   const sampleResponse = {
  //     data: {
  //       rowCount: 5,
  //     },
  //   };
  //   (axios.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(sampleResponse));
  //   (axios.CancelToken as any) = {
  //     source: () => {
  //       return { token: undefined, cancel: () => undefined };
  //     },
  //   };

  //   const wrapper = mount(
  //     <Router history={history}>
  //       <BulkUpload {...props} />
  //     </Router>
  //   );

  //   // start upload page
  //   expect(wrapper.text()).toMatchSnapshot('start upload page');

  //   // simulate upload
  //   await act(async () => {
  //     const file = new File([''], 'file.csv');
  //     wrapper.find('input[type="file"]').simulate('change', { target: { files: [file] } });
  //     wrapper.update();
  //   });

  //   // should have a loading page
  //   expect(wrapper.text()).toMatchSnapshot('uploading card');
  //   expect(wrapper.find('StartUpload')).toHaveLength(1);
  //   wrapper.update();
  //   expect(toJson(wrapper)).toMatchInlineSnapshot('full snapshot');

  //   await act(async () => {
  //     await new Promise((resolve) => setImmediate(resolve));
  //     wrapper.update();
  //   });

  //   wrapper.unmount();
  // });
});
