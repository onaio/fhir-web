module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
    'typestrict',
  ],
  rules: {
    strict: 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-inferrable-types': 'warn',
    'jsdoc/require-param-type': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-returns': 0,
    'no-console': 1,
    'prettier/prettier': 2,
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/no-large-snapshots': ['warn', { maxSize: 50, inlineMaxSize: 6 }],
    '@typescript-eslint/naming-convention': [
      'error',
      // variableLike - matches the same as variable, function and parameter
      {
        selector: 'variableLike',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      // typeLike - matches the same as class, interface, typeAlias, enum, typeParameter
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'jest', 'jsdoc'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
