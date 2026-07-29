import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('@navikt/eslint-config-aap').map((config) => ({
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    ...config,
  })),
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    settings: { react: { version: '19.2.8' } },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
