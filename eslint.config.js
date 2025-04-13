import js from '@eslint/js'
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.config.js'
    ]
  },

  js.configs.recommended,

  {
    ...vuePlugin.configs['vue3-recommended'],
    files: ['**/*.vue']
  },

  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }]
    }
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          js: 'espree',
          jsx: 'espree',
          ts: '@typescript-eslint/parser',
          tsx: '@typescript-eslint/parser'
        },
        extraFileExtensions: ['.vue']
      }
    }
  },

  prettier
]
