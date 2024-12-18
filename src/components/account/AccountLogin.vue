<script setup>
  import { useAuthStore } from '@/stores/auth.store';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const loginRequest = ref({
    loginId: '',
    password: '',
  });

  const valid = ref(false);
  const errorMessage = ref('');

  const loginIdRules = [
    v => !!v || '아이디는 필수 입력 항목입니다.',
    v => (v && v.length >= 4) || '아이디는 최소 4자 이상이어야 합니다.',
  ];

  const passwordRules = [
    v => !!v || '비밀번호는 필수 입력 항목입니다.',
    v => (v && v.length >= 4) || '비밀번호는 최소 4자 이상이어야 합니다.',
  ];

  const loginBtn = async () => {
    if (!valid.value) {
      return;
    }
    try {
      await authStore.login(loginRequest.value);
    } catch (error) {
      console.error('로그인 실패:', error);
      errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
    }
  };

  const signupBtn = () => {
    router.push({ path: '/signup' });
  };
</script>

<template>
  <v-sheet class="pt-16" rounded>
    <v-card class="mx-auto px-6 py-8" :elevation="12" max-width="50%">
      <div class="pa-10">
        <h1 class="mb-10" style="text-align: center">로그인</h1>
        <v-alert v-if="errorMessage" class="mb-4" dismissible type="error">
          {{ errorMessage }}
        </v-alert>
        <v-form ref="form" v-model="valid" @submit.prevent="loginBtn">
          <v-text-field
            v-model="loginRequest.loginId"
            label="아이디"
            prepend-inner-icon="mdi-account"
            required
            :rules="loginIdRules"
          ></v-text-field>
          <v-text-field
            v-model="loginRequest.password"
            label="비밀번호"
            prepend-inner-icon="mdi-lock"
            required
            :rules="passwordRules"
            type="password"
          ></v-text-field>
          <v-btn
            block
            class="mb-3"
            color="blue lighten-1 text-capitalize"
            dark
            depressed
            :disabled="!valid"
            large
            type="submit"
          >
            로그인
          </v-btn>
          <v-btn
            block
            color="blue lighten-1 text-capitalize"
            dark
            depressed
            large
            @click="signupBtn"
          >
            회원가입
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-sheet>
</template>
