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

// TODO: 이거 붙이면 push 되다 안되다 하는거 해결해야함.
router.beforeEach(async to => {
  const privatePages = [
    '/free/write',
    '/free/write/:id',
    '/gallery/write',
    '/gallery/write/:id',
    '/ask/write',
    '/ask/write/:id',
  ];
  const authRequired = privatePages.includes(to.path);

  const authStore = useAuthStore();

  if (authRequired && !authStore.nickname) {
    return '/login';
  }
});

export default router;
