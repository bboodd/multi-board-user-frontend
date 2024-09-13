import { freeAxios } from '..';

// 게시글 리스트 정보 조회
const getPosts = async searchDto => {
  const res = await freeAxios.get('/posts', {
    params: searchDto,
  });

  return res.data;
};

// 게시글 정보 조회
const getPost = async postId => {
  const res = await freeAxios.get(`/posts/${postId}`);
  return res.data;
};

// 게시글 등록
const savePost = async post => {
  const res = await freeAxios.post('/posts', post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 게시글 수정
const updatePost = async (postId, post) => {
  const res = await freeAxios.put(`/posts/${postId}`, post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 게시글 삭제
const deletePost = async postId => {
  const res = await freeAxios.delete(`/posts/${postId}`);
  return res.data;
};

export { getPosts, getPost, savePost, updatePost, deletePost };
