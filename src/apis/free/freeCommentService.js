import { freeAxios } from '..';

// 댓글 리스트 정보 조회
const getCommentList = async postId => {
  const res = await freeAxios.get(`/posts/${postId}/comments`);
  return res.data;
};

// 댓글 저장
const saveComment = async (postId, comment) => {
  const res = await freeAxios.post(`/posts/${postId}/comments`, comment);
  return res.data;
};

// 댓글 삭제
const deleteComment = async (postId, commentId) => {
  const res = await freeAxios.deleteComment(
    `/posts/${postId}/comments/${commentId}`
  );
  return res.data;
};

export { getCommentList, saveComment, deleteComment };
