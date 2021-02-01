import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import { BULK_UPLOAD_PARAM, INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import { updateUrlWithStatusCreator, UploadStatus, CardTitle } from '../utils';
import React from 'react';
const history = createBrowserHistory();

const props = {
  history,
  location: {
    hash: '',
    pathname: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
    url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
  },
};

const updateUrl = updateUrlWithStatusCreator(props);

describe('utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('updateUrlWithStatusCreator works correctly', () => {
    const pushMock = jest.fn();
    props.history.push = pushMock;
    updateUrl();

    expect(pushMock).toHaveBeenCalledWith('/inventory/list?');
  });

  it('test when search param is given but no status', () => {
    const locationProps = {
      history,
      location: {
        hash: '',
        pathname: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        search: `?${BULK_UPLOAD_PARAM}=step`,
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
      },
    };
    const updateUrl = updateUrlWithStatusCreator(locationProps);
    const pushMock = jest.fn();
    props.history.push = pushMock;
    updateUrl();

    expect(pushMock).toHaveBeenCalledWith('/inventory/list?');
  });

  it('test when search param is given and status', () => {
    const locationProps = {
      history,
      location: {
        hash: '',
        pathname: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        search: `?${BULK_UPLOAD_PARAM}=step`,
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
      },
    };
    const updateUrl = updateUrlWithStatusCreator(locationProps);
    const pushMock = jest.fn();
    props.history.push = pushMock;
    updateUrl(UploadStatus.POST_CONFIRMATION_ERROR);

    expect(pushMock).toHaveBeenCalledWith('/inventory/list?bulkStep=postConfirmationError');
  });

  it('test default card title', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = {} as any;
    const wrapper = mount(<CardTitle {...props} />);

    expect(wrapper.text()).toMatchInlineSnapshot(`""`);
  });
});
