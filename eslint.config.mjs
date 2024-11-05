import eslintRecommended from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-config-prettier';

export default [
  {
    files: ['*.js', '*.ts', '*.tsx', 'src/**/*.{js,ts,tsx}'], // Apply these settings only to TypeScript files
    languageOptions: {
      ecmaVersion: 2021, // Support for ES2021 features
      sourceType: 'module', // Enable ES modules (import/export)
      parser: typescriptEslintParser, // Set @typescript-eslint parser for TypeScript files
      parserOptions: {
        ecmaVersion: 2020, // Allows modern ECMAScript features
        sourceType: 'module', // Enable ES modules
        tsconfigRootDir: process.cwd(), // Points to the current directory for tsconfig
        project: ['./tsconfig.json'], // Specify the TypeScript config file path
      },
      globals: {
        window: 'readonly', // Globals for browser
        document: 'readonly',
        console: 'readonly',
        module: 'readonly',
        process: 'readonly', // Globals for Node.js
        __dirname: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin, // Add the TypeScript plugin
    },

    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules, // Inherit rules from @typescript-eslint/recommended
      ...eslintRecommended.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-undef': 'off',
      'no-console': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // Apply Prettier rules to prevent conflicts with TypeScript/ESLint formatting rules
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.rules, // Disable rules that conflict with Prettier
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'logs/', '.env'], // Ignore files/folders
  },
];
