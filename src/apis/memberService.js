import axiosInstance from '.';

// 로그인
const authentication = async loginRequest => {
  const res = await axiosInstance.post('/members/login', loginRequest);

  return res.data.data;
};

// 아이디 중복확인
const checkDuplicate = async checkDuplicateRequest => {
  const res = await axiosInstance.post(
    '/members/check-duplicate',
    checkDuplicateRequest,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return res.data;
};

// 회원가입
const signup = async signupRequest => {
  const res = await axiosInstance.post('/members/signup', signupRequest, {
    headers: { 'Content-Type': 'application/json' },
  });

  return res.data;
};

export { authentication, checkDuplicate, signup };
