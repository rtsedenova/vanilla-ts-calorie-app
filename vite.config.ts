import Inspect from 'vite-plugin-inspect'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

import { resolve } from 'path'

export default {
  plugins: [
    Inspect(),
    ViteImageOptimizer({
      jpg: {
        quality: 100
      }
    }),
    ViteMinifyPlugin({})
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
}
