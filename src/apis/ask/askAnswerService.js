import { askAxios } from '..';

// 댓글 리스트 정보 조회
const getAnswerList = async postId => {
  const res = await askAxios.get(`/posts/${postId}/answers`);
  return res.data;
};

export { getAnswerList };
