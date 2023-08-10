/* eslint-disable @typescript-eslint/no-explicit-any */
import { LanguageCode } from '@opensrp/pkg-config';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { LanguageOptions, LanguageSwitcher } from '..';

describe('components/pages/languageSwitcher', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    shallow(<LanguageSwitcher />);
  });

  it('works correctly', () => {
    const languageOptions: LanguageOptions = {
      en: 'English',
      fr: 'Français',
      ar: 'Arabic',
    };

    const languageHandlerMock = jest.fn();

    const props = {
      onLanguageChange: languageHandlerMock,
      allLanguageOptions: languageOptions,
      supportedLanguages: ['en', 'fr'] as LanguageCode[],
    };

    const wrapper = mount(<LanguageSwitcher {...props} />);

    const moreOptions = wrapper.find('.more-options [data-testid="more-options"]').last();
    expect(moreOptions).toHaveLength(1);
    moreOptions.simulate('click');

    expect(wrapper.text()).toMatchInlineSnapshot(`"EnglishFrançais"`);

    // choose language change to french
    wrapper.find('button').at(0).simulate('click');
    expect(languageHandlerMock.mock.calls).toEqual([['en']]);

    wrapper.find('button').at(1).simulate('click');
    expect(languageHandlerMock.mock.calls).toEqual([['en'], ['fr']]);
    wrapper.update();
  });

  it('shows all options when supportedLangues is not defined', () => {
    const languageOptions: LanguageOptions = {
      en: 'English',
      fr: 'Français',
      ar: 'Arabic',
    };

    const props = {
      allLanguageOptions: languageOptions,
      supportedLanguages: [],
    };

    const wrapper = mount(<LanguageSwitcher {...props} />);
    expect(wrapper.find('.more-options [data-testid="more-options"]').last()).toHaveLength(1);

    expect(wrapper.text()).toMatchInlineSnapshot(`""`);
  });
});
