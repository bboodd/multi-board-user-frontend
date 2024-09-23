import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export const setInterceptors = axiosService => {
  axiosService.interceptors.request.use(
    // 요청 보내기 전
    config => {
      const { accessToken } = useAuthStore();

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

  axiosService.interceptors.response.use(
    response => {
      //   console.log(response);
      // 서버에 요청을 보내고 나서 응답을 받기 전
      // - 200번대 응답은 여기서 처리
      return response;
    },
    error => {
      console.log('ERROR >>>', error.response.data);
      const originalRequest = error.config;
      const { refreshToken, updateAccessToken, logout } = useAuthStore();

      // 응답이 에러인 경우
      // - 200번대 외의 응답은 여기서 처리

      if (error.response.status === 401) {
        // 리프레시 토큰이 있다면
        if (refreshToken?.length) {
          axios
            .post('/api/token/refresh', refreshToken)
            .then(res => {
              console.log(res);
              updateAccessToken(res.data?.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
              return axiosService(originalRequest);
            })
            .catch(error => {
              alert('다시 로그인 해 주세요.');
              logout();
              router.push('/');
              return Promise.reject(error);
            });
        } else {
          // 리프레시 토큰이 없다면
          router.push('/');
        }
      }

      if ([400, 404, 500].includes(error.response.status)) {
        alert(error.response.data.message);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return axiosService;
};
