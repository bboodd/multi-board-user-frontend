<!-- PageHeader.vue -->
<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { nickname, accessToken } = storeToRefs(authStore);

// 네비게이션 아이템 정의
const navItems = ref([
  {
    title: '공지사항',
    path: '/notice',
  },
  {
    title: '자유게시판',
    path: '/free',
  },
  {
    title: '갤러리',
    path: '/gallery',
  },
  {
    title: 'Q&A',
    path: '/qna',
  },
]);

watch(
  () => accessToken.value,
  async newToken => {
    if (newToken) {
      try {
        await authStore.validateToken();
      } catch (error) {
        console.error('Failed to validate token:', error);
      }
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (accessToken.value && !nickname.value) {
    try {
      await authStore.validateToken();
    } catch (error) {
      console.error('Failed to validate token on mount:', error);
    }
  }
});

const isLoggedIn = computed(() => !!nickname.value);

const isActive = basePath => {
  return route.path.startsWith(basePath);
};

const loginBtn = () => {
  authStore.returnUrl = route.fullPath; // 현재 경로 저장
  router.push({ path: '/login' });
};

const logoutBtn = () => {
  authStore.logout();
};
</script>

<template>
  <header>
    <h1 id="nav">
      <router-link to="/">
        <span style="font-size: 30px"> 다중 게시판 </span>
      </router-link>
    </h1>
    <nav>
      <v-toolbar id="nav" color="white" flat>
        <template v-for="(item, index) in navItems" :key="index">
          <router-link
            :class="{ 'router-link-active': isActive(item.path) }"
            :to="item.path"
          >
            {{ item.title }}
          </router-link>
          <v-divider
            v-if="index < navItems.length - 1"
            class="ms-3 border-opacity-75"
            color="gray"
            vertical
          />
        </template>

        <v-spacer />

        <div v-if="!isLoggedIn" class="d-flex align-center">
          <v-btn @click="loginBtn">
            <span>로그인 / 회원가입</span>
            <v-icon end>mdi-login-variant</v-icon>
          </v-btn>
        </div>

        <div v-else class="d-flex align-center">
          <v-toolbar-title class="user-greeting">
            <span>{{ nickname }}님 안녕하세요</span>
          </v-toolbar-title>
          <v-btn @click="logoutBtn">
            <span>로그아웃</span>
            <v-icon end>mdi-logout-variant</v-icon>
          </v-btn>
        </div>
      </v-toolbar>
    </nav>
  </header>
  <hr />
</template>

<style scoped>
.user-greeting {
  font-size: 15px;
  margin-right: 10px;
}

@media (max-width: 768px) {
  #nav a {
    font-size: 16px;
    margin-left: 8px;
    margin-right: 2px;
  }
}

#nav {
  padding: 5px;
}

#nav a {
  font-weight: bold;
  font-size: 20px;
  color: #2c3e50;
  margin-left: 15px;
  margin-right: 3px;
}

#nav a.router-link-active {
  color: #42b983;
}
</style>
