import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.js'],
          safelist: {
            standard: [/^v-/, /^el-/]
          },
          defaultExtractor: (content: string): string[] =>
            content.match(/[\w-/:]+(?<!:)/g) || []
        }),
        autoprefixer({
          overrideBrowserslist: ['last 4 versions', 'not dead']
        })
      ]
    }
  }
});
