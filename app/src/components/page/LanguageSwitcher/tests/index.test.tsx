import { mount, shallow } from 'enzyme';
import React from 'react';
import { LanguageSwitcher } from '..';
import i18n from '../../../../mls';

jest.mock('../../../../configs/env');

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const CustomDropDown = (props: any) => {
    return (
      <>
        {props.overlay}
        {props.children}
      </>
    );
  };
  return {
    ...actual,
    Dropdown: CustomDropDown,
  };
});

describe('components/pages/languageSwitcher', () => {
  it('renders correctly', () => {
    shallow(<LanguageSwitcher />);
  });

  it('works correctly', () => {
    const wrapper = mount(<LanguageSwitcher />);
    const i18nSpy = jest.spyOn(i18n, 'changeLanguage');
    expect(wrapper.find('button')).toHaveLength(1);

    expect(wrapper.text()).toMatchInlineSnapshot(`"EnglishFrançais"`);

    // choose language change to french
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(i18nSpy.mock.calls).toEqual([['en_core']]);

    wrapper.find('MenuItem').at(2).simulate('click');
    expect(i18nSpy.mock.calls).toEqual([['en_core'], ['fr_core']]);
    wrapper.update();
  });
});
