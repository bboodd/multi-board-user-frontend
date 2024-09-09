/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

router.beforeEach(async to => {
  const authStore = useAuthStore();
  const { returnUrl, accessToken } = storeToRefs(authStore);
  const authRequired = await authRequiredCheck(to);
  if (authRequired && !accessToken.value) {
    returnUrl.value = to.fullPath;
    return '/login';
  }
});

/**
 * 로그인이 필요한 경로인지 체크하는 함수
 * @param {*} to - 경로
 * @returns - boolean
 */
const authRequiredCheck = to => {
  const privatePages = [
    '/free/write',
    '/free/write/:id',
    '/gallery/write',
    '/gallery/write/:id',
    '/ask/write',
    '/ask/write/:id',
  ];
  const privateParams = ['my'];
  const authRequiredBoolean =
    privatePages.includes(to.path) ||
    privateParams.some(key => Object.keys(to.query).includes(key));
  return authRequiredBoolean;
};

export default router;
