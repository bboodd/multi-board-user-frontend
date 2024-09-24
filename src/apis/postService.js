import axiosInstance from '.';

// 게시글 리스트 정보 조회
const getPosts = async (boardType, searchDto) => {
  const res = await axiosInstance.get(`/${boardType}/posts`, {
    params: searchDto,
  });

  return res.data;
};

// 게시글 정보 조회
const getPost = async (boardType, postId) => {
  const res = await axiosInstance.get(`/${boardType}/posts/${postId}`);
  return res.data;
};

// 게시글 등록
const savePost = async (boardType, post) => {
  const res = await axiosInstance.post(`/${boardType}/posts`, post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 게시글 수정
const updatePost = async (boardType, postId, post) => {
  const res = await axiosInstance.put(`/${boardType}/posts/${postId}`, post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 게시글 삭제
const deletePost = async (boardType, postId) => {
  const res = await axiosInstance.delete(`/${boardType}/posts/${postId}`);
  return res.data;
};

export { getPosts, getPost, savePost, updatePost, deletePost };
