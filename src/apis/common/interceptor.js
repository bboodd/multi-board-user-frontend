export const setInterceptors = axiosService => {
  axiosService.interceptors.request.use(
    // 요청 보내기 전
    config => {
      return config;
    },
    error => {
      // 요청이 잘못 되엇을 때 에러가 컴포넌트 단으로 오기 전
      return Promise.reject(error);
    }
  );

  axiosService.interceptors.response.use(
    response => {
      console.log(response);
      // 서버에 요청을 보내고 나서 응답을 받기 전
      // - 200번대 응답은 여기서 처리
      return response;
    },
    error => {
      console.log('ERROR >>>', error.response.data);
      const originalRequest = error.config;
      console.log(originalRequest);

      // 응답이 에러인 경우
      // - 200번대 외의 응답은 여기서 처리

      // if (error.response.status === 400) {
      //   alert(error.response.data.message);
      // }
      // if (error.response.status === 404) {
      //   alert(error.response.data.message);
      // }
      // if (error.response.status === 500) {
      //   alert(error.response.data.error);
      // }

      return Promise.reject(error);
    }
  );

  return axiosService;
};
