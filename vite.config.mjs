// Plugins
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Fonts from 'vite-plugin-webfont-dl';
import Layouts from 'vite-plugin-vue-layouts';
import Vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// 커스텀 플러그인 정의: 모든 폰트 preload 링크 제거
function removeAllFontPreloads() {
  return {
    name: 'remove-all-font-preloads',
    transformIndexHtml: {
      enforce: 'post', // 다른 변환 후에 실행되도록 설정
      transform(html) {
        // 모든 폰트 preload 링크 제거
        return html.replace(/<link rel="preload" as="font"[^>]*>/g, '');
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      VueRouter(),
      Layouts({
        layoutsDirs: 'src/layouts',
        defaultLayout: 'default',
      }),
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Components(),
      Fonts({
        google: {
          families: [
            {
              name: 'Roboto',
              styles: 'wght@100;300;400;500;700;900',
            },
          ],
        },
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
      removeAllFontPreloads(),
    ],
    base: '/',
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      port: 3000,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
    },
  };
});
