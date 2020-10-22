import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import NotFound from '..';
import toJson from 'enzyme-to-json';
import { History } from 'history';

const NotFoundLocation = 'pageurlwhichisnotavalible';

describe('src/components/NotFound', () => {
  it('renders correctly', () => {
    const wrapper = mount(<NotFound pathtoredirectto="./" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('redirects to home on button click', () => {
    let his: History<unknown>;
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: NotFoundLocation, search: '?next=%2F', hash: '', state: {} }]}
      >
        <Route
          render={({ history }) => {
            his = history;
            return <NotFound pathtoredirectto="./home" />;
          }}
        />
      </MemoryRouter>
    );

    // assert about url
    expect(his.location.pathname).toBe('pageurlwhichisnotavalible');
    wrapper.find('button').simulate('click');
    expect(his.location.pathname).toBe('home');
  });
});
