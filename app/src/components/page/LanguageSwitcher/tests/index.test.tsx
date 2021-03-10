import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { LanguageSwitcher } from '..';

jest.mock('../../../../configs/env');

describe('components/pages/languageSwitcher', () => {
  it('renders correctly', () => {
    shallow(<LanguageSwitcher />);
  });

  /** need to make sure that once an option is clicked the correct language is set
   * and preferably that the components switched language
   */
  it('works correctly', () => {
    const wrapper = mount(<LanguageSwitcher />);
    expect(wrapper.find('button')).toHaveLength(1);
    // before opening dropdown
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    wrapper.find('button').simulate('click');
    // after opening dropdown
    expect(wrapper.text()).toMatchInlineSnapshot(`"enEnglishfrFrançais"`);

    // choose language change to french
    expect(toJson(wrapper.find('.ant-dropdown-menu-item'))).toMatchSnapshot('the language options');
    wrapper.find('.ant-dropdown-menu-item').at(1).simulate('click');
    wrapper.update();
  });
});
