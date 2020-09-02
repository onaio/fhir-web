module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  rules: {
    strict: 0,
  },
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
