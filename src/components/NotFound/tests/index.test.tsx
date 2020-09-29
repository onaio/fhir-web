import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import NotFound from '..';

const NotFoundLocation = 'pageurlwhichisnotavalible';

describe('src/components/NotFound', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: NotFoundLocation, search: '', hash: '', state: {} }]}
      >
        <NotFound />
      </MemoryRouter>
    );
    // should redirect to home
    expect(wrapper.find('.ant-result-404')).toHaveLength(1);
  });

  it('redirects to home on button click', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: NotFoundLocation, search: '', hash: '', state: {} }]}
      >
        <Switch>
          {/* tslint:disable-next-line: jsx-no-lambda */}
          <Route path="/" component={() => <div id="home" />} />
          {/* tslint:disable-next-line: jsx-no-lambda */}
          <Route component={() => <NotFound />} />
        </Switch>
      </MemoryRouter>
    );

    // should redirect to teams
    expect(wrapper.find('.ant-result-404')).toHaveLength(1);
    wrapper.find('button').simulate('click');

    expect(wrapper.find('.ant-result-404')).toHaveLength(0);
    expect(wrapper.find('#home')).toHaveLength(1);
  });
});
