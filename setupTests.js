/* eslint-disable @typescript-eslint/no-empty-function */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// learn more: https://github.com/testing-library/jest-dom
import enzyme from 'enzyme';
// temp react 17 enzyme adapter before official adapter is released - https://github.com/enzymejs/enzyme/issues/2429#issuecomment-679265564
import Adapter from '@cfaester/enzyme-adapter-react-18';
import MockDate from 'mockdate';
import { setAllConfigs } from '@opensrp/pkg-config';
/* eslint-disable @typescript-eslint/naming-convention */
import { setLogger } from 'react-query';

jest.mock('fhirclient', () => ({
  client: jest.fn().mockImplementation(() => {
    return {
      request: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  }),
}));

setAllConfigs({
  projectCode: 'core',
  TablesState: {},
  languageCode: 'en',
});

// TODO - don't mock this globally. Problematic when relying on Nock
global.fetch = require('jest-fetch-mock');
MockDate.set('2017-07-13T19:31:00.000Z'); // 7-13-17 19:31 => Mersenne primes :)

enzyme.configure({
  adapter: new Adapter(),
});

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
window.__PRELOADED_STATE__ = { random: 'Preloaded state, baby!' };

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

// disable react-query errors and warning on console during tests
// eg "API is down" when testing api failure
setLogger({
  log: () => {},
  warn: () => {},
  error: () => {},
});
