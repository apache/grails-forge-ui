module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['react', 'import'],
  rules: {
    // React 17+ automatic JSX transform does not require React in scope
    'react/react-in-jsx-scope': 'off',
    // Project does not use PropTypes
    'react/prop-types': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-case-declarations': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.*'],
      env: {
        jest: true,
      },
    },
  ],
}
