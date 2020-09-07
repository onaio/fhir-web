import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { history } from '@onaio/connected-reducer-registry';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import Home from '../Home';

describe('containers/pages/Home', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <Home />
      </Router>
    );
  });

  it('renders Home correctly & changes Title of page', () => {
    const wrapper = mount(
      <Router history={history}>
        <Home />
      </Router>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });
});
