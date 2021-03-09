// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// learn more: https://github.com/testing-library/jest-dom
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockDate from 'mockdate';
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
window.__PRELOADED_STATE__ = { random: 'Preloaded state, baby!' };
