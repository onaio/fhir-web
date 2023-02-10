import { mount } from 'enzyme';
import React from 'react';
import { Resource404 } from '..';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

const history = createBrowserHistory();

describe('broken page', () => {
  it('renders correctly', () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;
    const wrapper = mount(
      <Router history={history}>
        <Resource404></Resource404>
      </Router>
    );

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });
});
