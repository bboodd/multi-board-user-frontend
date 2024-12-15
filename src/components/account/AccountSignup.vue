<script setup>
import {
  checkDuplicateLoginId,
  checkDuplicateNickname,
  signup,
} from '@/apis/memberService';
import { useRouter } from 'vue-router';

const router = useRouter();

const valid = ref(false);
const signupRequest = ref({
  loginId: '',
  password: '',
  checkPassword: '',
  nickname: '',
});
const loading = ref(false);
const loginIdAlreadyExists = ref([]);
const nicknameAlreadyExists = ref([]);
const rules = ref({
  loginId: [
    v => !!v || 'ID는 필수입니다.',
    v =>
      (v && v.length >= 4 && v.length <= 12) ||
      'ID는 4글자 이상 12글자 이하여야 합니다.',
    v => {
      const regxp = /^[a-z0-9_-]{4,12}$/;
      return (
        !!regxp.test(v) ||
        "ID는 '-','_'외 특수문자를 제외한 4자리 이상 12자리 미만 영문또는 숫자이어야 합니다"
      );
    },
  ],
  password: [
    v => !!v || '비밀번호는 필수입니다.',
    v =>
      (v && v.length >= 4 && v.length <= 16) ||
      '비밀번호는 4글자 이상 16글자 이하여야 합니다.',
    v => {
      const regxp = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,16}$/;
      return (
        !!regxp.test(v) ||
        '비밀번호는 4글자 이상, 16글자 미만인 영문/숫자/특수문자를 포함한 문자여야 합니다.'
      );
    },
    v => {
      const regxp = /^(?!.*(.)\1{2})/;
      return (
        !!regxp.test(v) ||
        '비밀번호에 동일만 문자 혹은 숫자는 3회 이상 반복할 수 없습니다.'
      );
    },
  ],
  checkPassword: [
    v => !!v || '비밀번호를 한번 더 입력해주세요.',
    v => passwordEqualsCheck(v) || '입력한 비밀번호와 다릅니다.',
  ],
  nickname: [
    v => !!v || '별명은 필수입니다.',
    v =>
      (v && v.length >= 2 && v.length <= 10) ||
      '별명은 2글자 이상 10글자 이하여야 합니다.',
    v => {
      const regxp = /^[가-힣a-zA-Z0-9]{2,10}$/;
      return (
        !!regxp.test(v) ||
        '이름은 2글자 ~ 10글자의 영문/숫자/한글 이어야 합니다.'
      );
    },
  ],
});

/**
 * 회원가입 버튼 함수
 */
const submit = async () => {
  if (!valid.value) return;

  try {
    loading.value = true;
    await signup(signupRequest.value);
    alert('회원가입 완료');
    router.push({ path: '/login' });
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
    console.error('회원가입 실패:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 아이디 중복확인 여부 확인하는 함수
 * @param e - event
 */
const loginIdDuplicateCheck = async e => {
  loginIdAlreadyExists.value = ['아이디 중복 확인중...'];
  const checkDuplicateRequest = {
    value: e.target.value,
  };
  const res = await checkDuplicateLoginId(checkDuplicateRequest);

  if (res.data) {
    loginIdAlreadyExists.value = [];
  } else {
    loginIdAlreadyExists.value = ['중복된 아이디 입니다.'];
  }
};

/**
 * 닉네임 중복확인 여부 확인하는 함수
 * @param e - event
 */
const nicknameDuplicateCheck = async e => {
  nicknameAlreadyExists.value = ['닉네임 중복 확인중...'];
  const checkDuplicateRequest = {
    value: e.target.value,
  };
  const res = await checkDuplicateNickname(checkDuplicateRequest);

  if (res.data) {
    nicknameAlreadyExists.value = [];
  } else {
    nicknameAlreadyExists.value = ['중복된 닉네임 입니다.'];
  }
};

/**
 * 비밀번호 + 비밀번호 확인 일치여부 확인 함수
 * @param checkPassword - 비밀번호 확인 필드 입력값
 */
const passwordEqualsCheck = checkPassword => {
  return signupRequest.value.password === checkPassword;
};
</script>

<template>
  <v-sheet class="pa-16" rounded>
    <v-card class="mx-auto px-6 py-8" :elevation="12" max-width="40%">
      <v-form v-model="valid" validate-on="blur" @submit.prevent="submit">
        <v-text-field
          v-model="signupRequest.loginId"
          class="mb-2"
          clearable
          :counter="12"
          :error-messages="loginIdAlreadyExists"
          label="아이디"
          prepend-inner-icon="mdi-account"
          :readonly="loading"
          :rules="rules.loginId"
          @change="loginIdDuplicateCheck"
        ></v-text-field>

        <v-text-field
          v-model="signupRequest.password"
          clearable
          :counter="16"
          label="비밀번호"
          prepend-inner-icon="mdi-lock"
          :readonly="loading"
          :rules="rules.password"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="signupRequest.checkPassword"
          clearable
          :counter="16"
          label="비밀번호 확인"
          prepend-inner-icon="mdi-lock"
          :readonly="loading"
          required
          :rules="rules.checkPassword"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="signupRequest.nickname"
          clearable
          :counter="10"
          :error-messages="nicknameAlreadyExists"
          label="이름"
          prepend-inner-icon="mdi-account"
          :readonly="loading"
          required
          :rules="rules.nickname"
          @change="nicknameDuplicateCheck"
        ></v-text-field>

        <br />

        <v-btn
          block
          color="primary"
          :disabled="!valid"
          :loading="loading"
          size="large"
          type="submit"
          variant="elevated"
        >
          회원가입
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>
