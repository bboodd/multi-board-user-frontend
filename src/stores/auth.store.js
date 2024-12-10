import { defineStore } from 'pinia';
import { authentication, me } from '@/apis/memberService';
import router from '@/router';
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(
    JSON.parse(localStorage.getItem('accessToken') || 'null')
  );
  const nickname = ref(JSON.parse(localStorage.getItem('nickname') || 'null'));
  const refreshToken = ref(null);
  const returnUrl = ref(null);

  const login = async loginRequest => {
    try {
      const res = await authentication(loginRequest);
      accessToken.value = res.data.accessToken;
      localStorage.setItem('accessToken', JSON.stringify(accessToken.value));

      // 로그인 후 사용자 정보 조회
      await validateToken();

      const lastPath = router.options.history.state.back;
      // returnUrl이 있으면 우선 사용
      const redirectPath =
        returnUrl.value || (lastPath === '/signup' ? '/' : lastPath || '/');
      returnUrl.value = null; // returnUrl 초기화

      router.push(redirectPath);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    accessToken.value = null;
    nickname.value = null;
    returnUrl.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');

    router.push('/');
  };

  const updateAccessToken = newAccessToken => {
    accessToken.value = newAccessToken;
    localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
  };

  const validateToken = async () => {
    if (!accessToken.value) return false;

    try {
      const response = await me();
      nickname.value = response.data.nickname;
      localStorage.setItem('nickname', JSON.stringify(nickname.value));
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      throw error;
    }
  };

  return {
    accessToken,
    nickname,
    refreshToken,
    returnUrl,
    login,
    logout,
    updateAccessToken,
    validateToken,
  };
});
