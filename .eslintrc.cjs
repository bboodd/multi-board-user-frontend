/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
    browser: true,
    es2022: true,
  },
  extends: [
    'vuetify',
    './.eslintrc-auto-import.json',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'always'],
    'import/no-unresolved': 'off',
    'comma-dangle': 'off',
    'no-new': 0,
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
  },
};
