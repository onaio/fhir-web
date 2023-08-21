import { mount } from 'enzyme';
import React from 'react';
import { ExtraLinks } from '..';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { HOME_URL } from '../../../constants';

const history = createBrowserHistory();

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

describe('ExtraLinks util component', () => {
  it('works correctly', () => {
    const mockBack = jest.fn();
    history.go = mockBack;

    const wrapper = mount(
      <Router>
        <ExtraLinks></ExtraLinks>
      </Router>
    );

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Go back"`);
    wrapper.find('button').first().simulate('click');

    expect(mockedUsedNavigate).toHaveBeenCalled();

    // click go back
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Go home"`);
    wrapper.find('button').last().simulate('click');

    expect(history.location.pathname).toEqual(HOME_URL);
  });
});
