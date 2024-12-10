<script setup>
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';

const authStore = useAuthStore();

const loginRequest = ref({
  loginId: '',
  password: '',
});

const loginBtn = async () => {
  try {
    await authStore.login(loginRequest.value);
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

const signupBtn = () => {
  router.push({ path: '/signup' });
};
</script>

<template>
  <v-sheet class="pa-16" rounded>
    <v-card class="mx-auto px-6 py-8" :elevation="12" max-width="40%">
      <div class="pa-10">
        <h1 class="mb-10" style="text-align: center">로그인</h1>
        <form @submit.prevent="loginBtn">
          <v-text-field
            v-model="loginRequest.loginId"
            label="아이디"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
          <v-text-field
            v-model="loginRequest.password"
            label="비밀번호"
            prepend-inner-icon="mdi-lock"
            type="password"
          >
          </v-text-field>
          <v-btn
            block
            class="mb-3"
            color="blue lighten-1 text-capitalize"
            dark
            depressed
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
        </form>
      </div>
    </v-card>
  </v-sheet>
</template>
