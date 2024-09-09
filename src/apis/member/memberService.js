import { memberAxios } from '..';

const authentication = async loginRequest => {
  const res = await memberAxios.post('/login', loginRequest);

  return res.data.data;
};

const checkDuplicate = async checkDuplicateRequest => {
  const res = await memberAxios.post(
    '/check-duplicate',
    checkDuplicateRequest,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return res.data;
};

const signup = async signupRequest => {
  const res = await memberAxios.post('/signup', signupRequest, {
    headers: { 'Content-Type': 'application/json' },
  });

  return res.data;
};

export { authentication, checkDuplicate, signup };
