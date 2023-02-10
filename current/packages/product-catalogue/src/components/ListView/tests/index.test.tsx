import React from 'react';
import { ConnectedProductCatalogueList } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { product1, products } from '../../../ducks/productCatalogue/tests/fixtures';
import { CATALOGUE_LIST_VIEW_URL } from '../../../constants';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { removeProducts } from '../../../ducks/productCatalogue';
import flushPromises from 'flush-promises';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('List view Page', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  beforeEach(() => {
    store.dispatch(removeProducts());
  });

  it('renders correctly', async () => {
    fetch.mockResponse(JSON.stringify([]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${CATALOGUE_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${CATALOGUE_LIST_VIEW_URL}`,
        url: `${CATALOGUE_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProductCatalogueList {...props}></ConnectedProductCatalogueList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Product Catalogue (0) + Add product to catalogueProduct NameIDActionsNo Data"`
    );

    // details view is not displayed
    expect(wrapper.find('.view-details-content')).toHaveLength(0);
  });

  it('sort works', async () => {
    const product3 = { ...product1, productName: 'Scale', uniqueId: '3' };
    fetch.mockResponse(JSON.stringify([...products, product3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${CATALOGUE_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${CATALOGUE_LIST_VIEW_URL}`,
        url: `${CATALOGUE_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProductCatalogueList {...props}></ConnectedProductCatalogueList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Product Catalogue (3)');

    // details view is not displayed
    expect(wrapper.find('.view-details-content')).toHaveLength(0);

    // find ant table
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows ${index}`);
    });

    // click on sort twice to change the order
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // click on sort twice to change the order
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows ${index}`);
    });
  });

  it('renders correctly with detailView', async () => {
    fetch.mockResponse(JSON.stringify(products));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${CATALOGUE_LIST_VIEW_URL}/1`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { productId: '1' },
        path: `${CATALOGUE_LIST_VIEW_URL}/:productId`,
        url: `${CATALOGUE_LIST_VIEW_URL}/1`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProductCatalogueList {...props}></ConnectedProductCatalogueList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find ant table
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows ${index}`);
    });

    // details view is displayed
    expect(wrapper.find('.view-details-content')).toHaveLength(2);

    expect(wrapper.find('div.view-details-content').text()).toMatchSnapshot('View details');
  });

  it('shows broken page', async () => {
    fetch.mockReject(new Error('Something went wrong'));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${CATALOGUE_LIST_VIEW_URL}/6`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { productId: '1' },
        path: `${CATALOGUE_LIST_VIEW_URL}/:productId`,
        url: `${CATALOGUE_LIST_VIEW_URL}/6`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProductCatalogueList {...props}></ConnectedProductCatalogueList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
  });
});
