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
    semi: ['error', 'always'], // 세미콜론 강제 사용
    'import/no-unresolved': 'off',
    'comma-dangle': 'off',
    'no-new': 0,
    indent: ['error', 2],
    'import/extensions': 'off',
  },
};
