module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true,
    node: true,
    worker: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['prettier', 'simple-import-sort'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    camelcase: 'warn',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-filename-extension': [1, { extensions: ['.test.js', '.jsx'] }],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
