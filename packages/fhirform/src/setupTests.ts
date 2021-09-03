// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// global.fetch = require('jest-fetch-mock');

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
