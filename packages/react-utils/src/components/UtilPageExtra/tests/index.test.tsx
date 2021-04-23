import { mount } from 'enzyme';
import React from 'react';
import { ExtraLinks } from '..';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { HOME_URL } from '../../../constants';

const history = createBrowserHistory();

describe('ExtraLinks util component', () => {
  it('works correctly', () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;
    const wrapper = mount(
      <Router history={history}>
        <ExtraLinks></ExtraLinks>
      </Router>
    );

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Go back"`);
    wrapper.find('button').first().simulate('click');

    expect(mockBack).toHaveBeenCalled();

    // click go back
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Go home"`);
    wrapper.find('button').last().simulate('click');

    expect(history.location.pathname).toEqual(HOME_URL);
  });
});
