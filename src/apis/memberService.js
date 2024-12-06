import axiosInstance from '.';

// 로그인
const authentication = async loginRequest => {
  const res = await axiosInstance.post('/auth/login', loginRequest);

  return res.data;
};

// 아이디 중복확인
const checkDuplicateLoginId = async checkDuplicateRequest => {
  const res = await axiosInstance.post(
    '/auth/check-duplicate/login-id',
    checkDuplicateRequest,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return res.data;
};

// 닉네임 중복확인
const checkDuplicateNickname = async checkDuplicateRequest => {
  const res = await axiosInstance.post(
    '/auth/check-duplicate/nickname',
    checkDuplicateRequest,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return res.data;
};

// 회원가입
const signup = async signupRequest => {
  const res = await axiosInstance.post('/auth/signup', signupRequest, {
    headers: { 'Content-Type': 'application/json' },
  });

  return res.data;
};

const me = async () => {
  const res = await axiosInstance.get('/members/me');

  return res.data;
};

export {
  authentication,
  checkDuplicateLoginId,
  checkDuplicateNickname,
  signup,
  me,
};
