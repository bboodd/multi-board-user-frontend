import { noticeAxios } from '..';

// 게시글 리스트 정보 조회
const getPosts = async searchDto => {
  const res = await noticeAxios.get('/posts', {
    params: searchDto,
  });

  return res.data;
};

// 게시글 정보 조회
const getPost = async postId => {
  const res = await noticeAxios.get(`/posts/${postId}`);
  return res.data;
};

// 공지글 리스트 조회
const getFinPosts = async () => {
  const res = await noticeAxios.get('/posts/fin');
  return res.data;
};

export { getPosts, getPost, getFinPosts };
