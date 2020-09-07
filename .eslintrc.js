module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: ['plugin:prettier/recommended'],
  rules: {
    strict: 0,
  },
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
};
