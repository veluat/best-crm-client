import js from '@eslint/js'
import vuePlugin from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  },
  js.configs.recommended,
  {
    ...vuePlugin.configs['vue3-recommended'],
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'error'
    }
  },
  {
    files: ['**/*.js']
  },
  prettier
]
