module.exports = {
  coverageReporters: ['lcov', 'json', 'html'],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx,ts,tsx}',
    'packages/**/*.{js,jsx,ts,tsx}',
    '!client/src/index.tsx',
    '!client/src/serviceWorker.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/{tests,__tests__}/**',
  ],
  setupFiles: ['./setupTests.js'],
  roots: ['packages', 'client'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};

// import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
