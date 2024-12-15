import axiosInstance from '.';

// 댓글 리스트 정보 조회
const getCommentList = async postId => {
  const res = await axiosInstance.get(`/posts/${postId}/comments`);
  return res;
};

// 댓글 저장
const saveComment = async (postId, comment) => {
  const res = await axiosInstance.post(`/posts/${postId}/comments`, comment);
  return res;
};

// 댓글 삭제
const deleteComment = async (postId, commentId) => {
  const res = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`
  );
  return res;
};

export { getCommentList, saveComment, deleteComment };
