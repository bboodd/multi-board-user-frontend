import axios from 'axios';
import { setInterceptors } from './common/interceptor';

// base url을 가지는 axios 생성
const createAxiosService = url => {
  const axiosService = axios.create({
    baseURL: `${import.meta.env.VITE_BOARD_API_URL}/${url}`,
  });

  return setInterceptors(axiosService);
};

export const freeAxios = createAxiosService('free-board');
export const memberAxios = createAxiosService('members');
