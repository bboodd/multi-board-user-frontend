// Plugins
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Fonts from 'unplugin-fonts/vite';
import Layouts from 'vite-plugin-vue-layouts';
import Vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

function fixFontPreloadLinks() {
  return {
    name: 'fix-font-preload-links',
    transformIndexHtml(html) {
      // 1. Fix MIME types for EOT and TTF
      html = html.replace(
        /<link rel="preload" as="font" type="font\/eot" href="([^"]+\.eot)" crossorigin="anonymous">/g,
        `<link rel="preload" as="font" type="application/vnd.ms-fontobject" href="$1" crossorigin="anonymous">`
      );

      html = html.replace(
        /<link rel="preload" as="font" type="font\/ttf" href="([^"]+\.ttf)" crossorigin="anonymous">/g,
        `<link rel="preload" as="font" type="font/ttf" href="$1" crossorigin="anonymous">`
      );

      // 2. Optionally remove EOT and TTF preloads if not needed
      // EOT는 구형 브라우저용으로, 최신 브라우저만 지원한다면 제거 가능
      html = html.replace(
        /<link rel="preload" as="font" type="application\/vnd\.ms-fontobject" href="[^"]+\.eot" crossorigin="anonymous">/g,
        ''
      );

      // TTF도 필요 없다면 제거
      html = html.replace(
        /<link rel="preload" as="font" type="font\/ttf" href="[^"]+\.ttf" crossorigin="anonymous">/g,
        ''
      );

      return html;
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
      fixFontPreloadLinks(),
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
