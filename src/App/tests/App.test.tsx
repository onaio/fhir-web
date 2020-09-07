import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import store from '../../store';
import App from '../App';

const history = createBrowserHistory();

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
