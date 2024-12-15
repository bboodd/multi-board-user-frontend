import axiosInstance from '.';

// 게시글 리스트 정보 조회
const getPosts = async (boardType, searchDto) => {
  const res = await axiosInstance.get(`/boards/${boardType}/posts`, {
    params: searchDto,
  });

  return res;
};

// 대시보드 게시글 정보 조회
const getDashboardPosts = async () => {
  const res = await axiosInstance.get('/boards/dashboard');
  return res;
};

// 게시글 정보 조회
const getPost = async (boardType, postId) => {
  const res = await axiosInstance.get(`/boards/${boardType}/posts/${postId}`);
  return res;
};

// 게시글 등록
const savePost = async (boardType, post) => {
  const res = await axiosInstance.post(`/boards/${boardType}/posts`, post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// 게시글 수정
const updatePost = async (boardType, postId, post) => {
  const res = await axiosInstance.put(
    `/boards/${boardType}/posts/${postId}`,
    post,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res;
};

// 게시글 삭제
const deletePost = async (boardType, postId) => {
  const res = await axiosInstance.delete(
    `/boards/${boardType}/posts/${postId}`
  );
  return res;
};

export {
  getPosts,
  getPost,
  savePost,
  updatePost,
  deletePost,
  getDashboardPosts,
};
