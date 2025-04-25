import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath, URL } from 'node:url'

import autoprefixer from 'autoprefixer'
import postcssCsso from 'postcss-csso'
import { terser } from 'rollup-plugin-terser'
import viteCompression from 'vite-plugin-compression'
import cssnano from 'cssnano'

const purgecss = require('@fullhuman/postcss-purgecss').default

export default defineNuxtConfig({
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/'
      ]
    }
  },
    modules: ['@pinia/nuxt'],
  
  app: {
    
    baseURL: '/store-prefix/',
    head: {
      title: 'Shop Name',
      meta: [
        { charset: 'utf-8' },
        { name: 'language', content: 'it' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'author', content: 'Shop Name' },
        { name: 'description', content: '' },
        { name: 'keywords', content: "products, ecc.."},
        { name: 'robots', content: 'index, follow' },
        { name: 'google-site-verification',
          content: process.env.NODE_ENV === 'production'
            ? process.env.VITE_GOOGLE_SITE_VERIFICATION || undefined
            : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        },
        { name: 'csrf-token',
          content: process.env.NODE_ENV === 'production'
            ? process.env.VITE_CSRF_TOKEN || undefined
            : 'CSRF_TOKEN'
        },
        { name: 'msapplication-TileColor', content: '#2d89ef' },
        { name: 'msapplication-config', content: '/favicon/browserconfig.xml' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.shop-name.com' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/favicon/favicon-194x194.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#008ad6' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' }
      ]
    },
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  runtimeConfig: {
    private: {
      VITE_API_ENDPOINT: process.env.VITE_API_ENDPOINT || 'http://localhost:8000'
    },
    public: {
      VITE_BASE_URL: process.env.VITE_BASE_URL || 'http://localhost:5173/store-prefix'
    }
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  css: ['@/assets/scss/main.scss'],
  vite: {
    plugins: [
      // '~/plugins/axios.client.ts',
      process.env.NODE_ENV === 'production' &&
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug', 'console.warn'],
          passes: 4
        },
        mangle: { toplevel: true },
        output: {
          comments: false,
          beautify: false,
          max_line_len: 80
        },
        keep_fnames: false,
        keep_classnames: false
      }),
      (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') &&
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        compressionOptions: { level: 11 }
      })
    ].filter(Boolean),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '@/assets/scss/global.scss' as *;"
        }
      },
      postcss: {
        plugins: [
          purgecss({
            content: [
              './public/**/*.html',
              './components/**/*.vue',
              './pages/**/*.vue',
              './plugins/**/*.js'
            ],
            safelist: { standard: [/^v-/, /^el-/] },
            defaultExtractor: (content: string) =>
              content.match(/[\w-/:]+(?<!:)/g) || []
          }),
          autoprefixer({
            overrideBrowserslist: ['last 4 versions', 'not dead']
          }),
          postcssCsso({
            restructure: true,
            comments: false,
            forceMediaMerge: true,
            sourceMap: false
          }),
          cssnano({ preset: 'default' })
        ].filter(Boolean)
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        '#imports': fileURLToPath(new URL('./imports', import.meta.url))
      }
    },
    
    server: {
      open: true,
      headers: {
        'Content-Security-Policy': process.env.NODE_ENV !== 'production'
          ? `default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: ${process.env.VITE_API_ENDPOINT} ${process.env.VITE_BASE_URL}; script-src 'self' 'nonce-random123' 'unsafe-inline' ${process.env.VITE_API_ENDPOINT}; object-src 'none'; frame-src 'self' https://maps.google.com https://www.google.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' ${process.env.VITE_API_ENDPOINT}; report-uri ${process.env.VITE_API_ENDPOINT}/api/csp-violation;`
          : `default-src 'self'; script-src 'nonce-random123' 'self' ${process.env.VITE_API_ENDPOINT}; style-src 'self'; img-src 'self' data: ${process.env.VITE_API_ENDPOINT} ${process.env.VITE_BASE_URL}; font-src 'self'; object-src 'none'; frame-src 'self' https://maps.google.com https://www.google.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' ${process.env.VITE_API_ENDPOINT} ${process.env.VITE_BASE_URL}; report-uri ${process.env.VITE_API_ENDPOINT}/api/csp-violation;`
      }
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
