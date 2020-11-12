import React from 'react';
import { ConnectedProductCatalogueList } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { product1 } from '../../../ducks/productCatalogue/tests/fixtures';
import { CATALOGUE_LIST_VIEW_URL } from '../../../constants';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('CreateEditProduct Page', () => {
  afterEach(() => {
    fetch.resetMocks();
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching product CataloguePlease wait, as we fetch the product Catalogue."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Product Catalogue (0) + Product CatalogueProduct NameIDActionsNo Data"`
    );

    // find ant table
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows ${index}`);
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Product Catalogue (0)');

    // details view is not displayed
    expect(wrapper.find('.view-details-content')).toHaveLength(0);
  });

  it('renders correctly with detailView', async () => {
    fetch.mockResponse(JSON.stringify([product1]));
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching product CataloguePlease wait, as we fetch the product Catalogue."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // details view is not displayed
    expect(wrapper.find('.view-details-content')).toHaveLength(0);

    expect(toJson(wrapper.find('view-details-content'))).toMatchSnapshot('View details');
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching product CataloguePlease wait, as we fetch the product Catalogue."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo BackBack Home"`);
  });
});
