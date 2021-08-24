import React from 'react';
import { CreateProductView } from '..';
import { store } from '@opensrp-web/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';
import { ProductForm } from '../../ProductForm';
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('CreateEditProduct Page', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly with store(for new product)', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateProductView></CreateProductView>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Add product to catalogue');

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);

    expect(wrapper.find(ProductForm).props()).toMatchSnapshot('new form props');
  });
});
