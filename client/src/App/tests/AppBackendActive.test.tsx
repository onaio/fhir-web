import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import App from '../App';


jest.mock('../../configs/env', () => ({
    BACKEND_ACTIVE: true
}));

// tslint:disable-next-line: no-var-requires

describe('App with active backend', () => {

  it('renders App correctly', async () => {
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

    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/fe/oauth/callback/opensrp',
      },
    });
    wrapper.unmount();
  });
});
