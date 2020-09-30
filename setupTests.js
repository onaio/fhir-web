// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// learn more: https://github.com/testing-library/jest-dom
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
global.fetch = require('jest-fetch-mock');

enzyme.configure({ adapter: new Adapter() });
library.add(faUser);
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
Object.defineProperty(window, 'location', {
  value: {
    href: window.location.href,
  },
  writable: true,
});
window.__PRELOADED_STATE__ = { random: 'Preloaded state, baby!' };
