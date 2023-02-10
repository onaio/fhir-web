import { PostConfirmationUpload } from '..';
import React from 'react';
import { mount } from 'enzyme';

describe('post confirmation upload card', () => {
  it('works  correctly', () => {
    const wrapper = mount(<PostConfirmationUpload />);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Inventory is being added to service points…Inventory may take a few minutes to appear."`
    );
  });
});
