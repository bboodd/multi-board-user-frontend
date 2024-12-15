import axiosInstance from '.';

// 카테고리 리스트 정보 조회
const getCategories = async boardType => {
  const res = await axiosInstance.get(`/boards/${boardType}/categories`);
  return res;
};

export { getCategories };
