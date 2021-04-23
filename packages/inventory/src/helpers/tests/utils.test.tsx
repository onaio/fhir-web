import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import { BULK_UPLOAD_PARAM, INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import {
  updateUrlWithStatusCreator,
  UploadStatus,
  CardTitle,
  disabledTreeNodesCallback,
} from '../utils';
import React from 'react';
import { generateJurisdictionTree } from '@opensrp/location-management/src/ducks/locationHierarchy/utils';
import { rawOpenSRPHierarchy1 } from '@opensrp/location-management/src/components/LocationForm/tests/fixtures';
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

    expect(pushMock).toHaveBeenCalledWith('/inventory?');
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

    expect(pushMock).toHaveBeenCalledWith('/inventory?');
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

    expect(pushMock).toHaveBeenCalledWith('/inventory?bulkStep=postConfirmationError');
  });

  it('test default card title', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = {} as any;
    const wrapper = mount(<CardTitle {...props} />);

    expect(wrapper.text()).toMatchInlineSnapshot(`""`);
  });

  it('test disableTreeNodesCallback', () => {
    const generatedTree = generateJurisdictionTree(rawOpenSRPHierarchy1);
    const rootNode = generatedTree;
    expect(disabledTreeNodesCallback(rootNode)).toBeTruthy();

    // sample commune node
    const communeNode = generatedTree.first(
      (node) => node.model.id === '421fe9fe-e48f-4052-8491-24d1e548daee'
    );
    expect(disabledTreeNodesCallback(communeNode)).toBeFalsy();
  });
});
