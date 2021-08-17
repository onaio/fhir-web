// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// learn more: https://github.com/testing-library/jest-dom
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockDate from 'mockdate';
import { setAllConfigs } from '@opensrp/pkg-config';
/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const configuredLanguage = `en_core`;

i18n
  .use(initReactI18next)
  .init({
    lng: configuredLanguage,
    fallbackLng: configuredLanguage,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    nsSeparator: '::',
    keySeparator: false,
    react: {
      useSuspense: false,
    },
  })
  .catch((err) => err);

setAllConfigs({
  i18n: i18n,
  projectLanguageCode: 'core',
  TablesState: {},
});

global.fetch = require('jest-fetch-mock');
MockDate.set('2017-07-13T19:31:00.000Z'); // 7-13-17 19:31 => Mersenne primes :)

enzyme.configure({ adapter: new Adapter() });

global.matchMedia =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  global.matchMedia ||
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

Object.defineProperty(window, 'location', {
  value: {
    href: window.location.href,
  },
  writable: true,
});

jest.mock('fhirclient', () => ({
  client: jest.fn().mockImplementation(() => {
    return {
      request: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
  }),
}));

window.__PRELOADED_STATE__ = { random: 'Preloaded state, baby!' };
