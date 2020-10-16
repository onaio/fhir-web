import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import NotFound from '..';
import toJson from 'enzyme-to-json';

const NotFoundLocation = 'pageurlwhichisnotavalible';

const App = () => {
  return <NotFound pathtoredirectto="./home" />;
};

describe('src/components/NotFound', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: NotFoundLocation, search: '', hash: '', state: {} }]}
      >
        <App />
      </MemoryRouter>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
