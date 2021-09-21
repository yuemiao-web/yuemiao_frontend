import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/miao': 'http://localhost:8000'
    }
  },
  alias: {
    '@': path.resolve(__dirname, 'src')
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        }
      ]
    })
  ]
})
