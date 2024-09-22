import { galleryAxios } from '..';

// 카테고리 리스트 정보 조회
const getCategories = async () => {
  const res = await galleryAxios.get('/categories');
  return res.data;
};

export { getCategories };
