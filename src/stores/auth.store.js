import { defineStore } from 'pinia';
import { authentication } from '@/apis/member/memberService';
// import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(JSON.parse(localStorage.getItem('accessToken')));
  const nickname = ref(JSON.parse(localStorage.getItem('nickname')));
  const refreshToken = ref(null);
  const returnUrl = ref(null);

  const login = loginRequest => {
    authentication(loginRequest).then(res => {
      nickname.value = res.nickname;
      accessToken.value = res.token.accessToken;

      localStorage.setItem('accessToken', JSON.stringify(accessToken.value));
      localStorage.setItem('nickname', JSON.stringify(nickname.value));

      router.push(returnUrl.value || '/');
    });
  };

  const logout = () => {
    accessToken.value = null;
    nickname.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');

    router.push('/');
  };

  const updateAccessToken = newAccessToken => {
    accessToken.value = newAccessToken;
  };

  return {
    accessToken,
    nickname,
    refreshToken,
    returnUrl,
    login,
    logout,
    updateAccessToken,
  };
});
