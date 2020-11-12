import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { ViewDetails } from '..';
import { product1 } from '../../../ducks/productCatalogue/tests/fixtures';

describe('View Details', () => {
  it('works correctly', () => {
    const props = { objectId: '1', object: product1 };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot('nominal display');
  });

  it('case without objectId', () => {
    const props = { objectId: '', object: product1 };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot('Should be null');
  });

  it('works when objectId is but Object isnt', () => {
    const props = { objectId: '1', object: null };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(wrapper.text()).toMatchInlineSnapshot();
  });
});
