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
  setupFiles: ['./setupTests'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  roots: ['packages/', 'app'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};

// import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config({ path: './app/.env.test' });
