import { mount } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import store from '../../store';
import App from '../App';
import { expressAPIResponse } from './fixtures';

jest.mock('../../configs/env');
const realLocation = window.location;

// tslint:disable-next-line: no-var-requires

describe('App', () => {
  beforeEach(() => {
    window.location = realLocation;
    fetch.mockResponse(JSON.stringify(expressAPIResponse));
    fetch.resetMocks();
    // Reset history
    history.push('/');
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('integration: renders App correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(`"···Home···Login···"`);

    await act(async () => {
      await new Promise<unknown>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // after resolving get oauth state request superset user is logged in
    expect(wrapper.find('Router').props().history).toMatchObject({
      location: {
        pathname: '/login',
      },
    });
    wrapper.unmount();
  });
});
