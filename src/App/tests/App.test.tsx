import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { history } from '@onaio/connected-reducer-registry';
import ReactDOM from 'react-dom';
import store from '../../store';
import App from '../App';

jest.mock('../../configs/env');

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
});
