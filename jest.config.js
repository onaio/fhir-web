module.exports = {
  coverageReporters: ['lcov', 'json', 'html'],
  collectCoverageFrom: [
    'app/src/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    '!app/src/configs/env.ts',
    '!app/src/index.tsx',
    '!app/src/serviceWorker.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/{tests,__tests__}/**',
  ],
  // these modules are not transpiled to commonjs, they also have un-transpiled scss code
  // which is added in the moduleNameMapper config further below
  transformIgnorePatterns: [
    'node_modules/(?!(@helsenorge/toolkit|@helsenorge/core-utils|@helsenorge/designsystem-react)/)',
  ],
  setupFiles: ['./setupTests'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  roots: ['packages/', 'app'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config({ path: './app/.env.test' });

process.env.TZ = 'UTC';
