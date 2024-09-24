import axiosInstance from '.';

// 댓글 리스트 정보 조회
const getCommentList = async (boardType, postId) => {
  const res = await axiosInstance.get(`/${boardType}/posts/${postId}/comments`);
  return res.data;
};

// 댓글 저장
const saveComment = async (boardType, postId, comment) => {
  const res = await axiosInstance.post(
    `/${boardType}/posts/${postId}/comments`,
    comment
  );
  return res.data;
};

// 댓글 삭제
const deleteComment = async (boardType, postId, commentId) => {
  const res = await axiosInstance.deleteComment(
    `/${boardType}/posts/${postId}/comments/${commentId}`
  );
  return res.data;
};

export { getCommentList, saveComment, deleteComment };
