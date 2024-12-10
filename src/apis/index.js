import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

const axiosInstance = axios.create({
  baseURL: `http://localhost:3000/api`,
});

axiosInstance.interceptors.request.use(
  // 요청 보내기 전
  //   request => {
  //     console.log(request);
  //     return request;
  //   },
  config => {
    const authStore = useAuthStore();
    const { accessToken } = authStore;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    //   console.log(JSON.stringify(config, null, 2));
    return config;
  },
  error => {
    // 요청이 잘못 되엇을 때 에러가 컴포넌트 단으로 오기 전
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    //   console.log(response);
    // 서버에 요청을 보내고 나서 응답을 받기 전
    // - 200번대 응답은 여기서 처리
    return response;
  },
  async error => {
    if (error.response) {
      const originalRequest = error.config;
      const authStore = useAuthStore();
      const { refreshToken, updateAccessToken, logout } = authStore;

      if (error.response.status === 401) {
        if (refreshToken?.length) {
          try {
            const res = await axiosInstance.post(
              '/token/refresh',
              refreshToken
            );
            const newAccessToken = res.data?.data.accessToken;

            updateAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest); // 원래 요청 재시도
          } catch (refreshError) {
            logout();
            router.push('/');
            throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
          }
        } else {
          logout();
          router.push('/');
          throw new Error('로그인이 필요합니다.');
        }
      }

      throw new Error(
        error.response.data.message || '서버 에러가 발생했습니다.'
      );
    }

    if (error.request) {
      throw new Error('네트워크 에러가 발생했습니다.');
    }

    throw error;
  }
);

export default axiosInstance;
