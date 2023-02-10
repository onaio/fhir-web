import { mount } from 'enzyme';
import React from 'react';
import { UnauthorizedPage, useHandleUnauthorizedPage } from '..';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { HOME_URL } from '../../../constants';

const history = createBrowserHistory();

describe('unauthorized page', () => {
  it('renders correctly', () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;
    const wrapper = mount(
      <Router history={history}>
        <UnauthorizedPage />
      </Router>
    );

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"ErrorSorry, you are not authorized to access this pageGo backGo home"`
    );

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Go back"`);
    wrapper.find('button').first().simulate('click');

    expect(mockBack).toHaveBeenCalled();

    // click go home
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Go home"`);
    wrapper.find('button').last().simulate('click');

    expect(history.location.pathname).toEqual(HOME_URL);
  });

  it('useHandleUnauthorizedPage works', () => {
    const errorDescription = 'Stuff did hit the fan';
    const MockApp = () => {
      const { unauthorized, errorMessage, handleUnauthorizedPage } = useHandleUnauthorizedPage();

      if (unauthorized) {
        return <h1>Unauthorized Page: {errorMessage}</h1>;
      }
      return (
        <button
          onClick={() => {
            const err = new Error(errorDescription);
            handleUnauthorizedPage(err);
          }}
        ></button>
      );
    };
    const wrapper = mount(
      <Router history={history}>
        <MockApp></MockApp>
      </Router>
    );
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    // simulate error
    wrapper.find('button').simulate('click');

    wrapper.update();

    expect(wrapper.text()).toMatchInlineSnapshot(`"Unauthorized Page: Stuff did hit the fan"`);
    expect(wrapper.text().includes(errorDescription)).toBeTruthy();
  });
});
