import { mount, MountRendererProps } from 'enzyme';
import React from 'react';
import {OpensrpWebI18nProvider} from '@opensrp/i18n';

export const mountWithTranslations: typeof mount = (
  component: React.ReactNode,
  options?: MountRendererProps
) => {
  return mount(<OpensrpWebI18nProvider>{component}</OpensrpWebI18nProvider>, options);
};
