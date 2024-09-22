import axios from 'axios';
import { setInterceptors } from './common/interceptor';

// base url을 가지는 axios 생성
const createAxiosService = url => {
  const axiosService = axios.create({
    baseURL: `http://localhost:3000/api/${url}`,
  });

  return setInterceptors(axiosService);
};

export const freeAxios = createAxiosService('free-board');
export const memberAxios = createAxiosService('members');
export const galleryAxios = createAxiosService('gallery-board');
