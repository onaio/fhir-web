module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: ['plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended','typestrict'],
  rules:  {
    strict: 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-inferrable-types': 'warn',
  },
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
};
