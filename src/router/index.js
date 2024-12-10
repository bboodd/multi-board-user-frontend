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

const privatePages = [
  '/free/write',
  '/free/write/:id',
  '/gallery/write',
  '/gallery/write/:id',
  '/qna/write',
  '/qna/write/:id',
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  const isDynamicImportError = err?.message?.includes?.(
    'Failed to fetch dynamically imported module'
  );
  const reloadKey = 'vuetify:dynamic-reload';

  if (isDynamicImportError) {
    if (!localStorage.getItem(reloadKey)) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem(reloadKey, 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error persists after reload:', err);
      localStorage.removeItem(reloadKey);
    }
  } else {
    console.error('Router error:', err);
  }
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // 동적 라우트 파라미터 처리
  const isPrivatePage = privatePages.some(page => {
    const regex = new RegExp('^' + page.replace(/:\w+/g, '[^/]+') + '$');
    return regex.test(to.path);
  });

  if (isPrivatePage) {
    // 토큰은 있지만 닉네임이 없는 경우 사용자 정보 재조회
    if (authStore.accessToken && !authStore.nickname) {
      try {
        await authStore.validateToken();
      } catch (error) {
        console.error('Token validation failed:', error);
        authStore.logout();
        authStore.returnUrl = to.fullPath;
        return '/login';
      }
    }

    // 토큰이 없거나 닉네임이 없는 경우
    if (!authStore.accessToken || !authStore.nickname) {
      authStore.returnUrl = to.fullPath;
      return '/login';
    }
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시
  if (authStore.nickname && ['/login', '/signup'].includes(to.path)) {
    return from.path || '/';
  }
});

(async () => {
  await router.isReady();
  localStorage.removeItem('vuetify:dynamic-reload');
})();

export default router;
