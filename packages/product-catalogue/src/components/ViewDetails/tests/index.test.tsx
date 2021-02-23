import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import { ViewDetails } from '..';
import { product1 } from '../../../ducks/productCatalogue/tests/fixtures';
import { createBrowserHistory } from 'history';
import { CATALOGUE_LIST_VIEW_URL } from '../../../constants';
import { act } from 'react-dom/test-utils';

const history = createBrowserHistory();

describe('View Details', () => {
  it('works correctly', () => {
    const props = { objectId: '1', object: product1 };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(wrapper.text()).toMatchSnapshot('nominal display');
  });

  it('case without objectId', () => {
    const props = { objectId: '', object: product1 };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot('Should be null');
  });

  it('works when objectId is but Object isnt', () => {
    const props = { objectId: '1', object: null };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });

  it('Closes on clicking cancle ', () => {
    const props = { objectId: '1', object: product1 };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    // simulate clicking on close button
    act(() => {
      wrapper.find('.flex-right button').simulate('click');
    });

    expect(wrapper.props().history.location.pathname).toEqual(CATALOGUE_LIST_VIEW_URL);
  });
});
