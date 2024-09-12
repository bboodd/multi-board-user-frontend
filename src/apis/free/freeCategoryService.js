import { freeAxios } from '..';

// 카테고리 리스트 정보 조회
const getCategoryList = async () => {
  const res = await freeAxios.get('/categories');
  return res.data;
};

export { getCategoryList };
