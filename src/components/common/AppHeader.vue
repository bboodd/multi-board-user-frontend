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
  <header class="border-b-md">
    <div class="header-content pl-4 pr-4">
      <h1 id="nav">
        <router-link to="/">
          <span style="font-size: 30px">게시판</span>
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
    </div>
  </header>
</template>

<style scoped>
  .header-content {
    width: 100%; /* 기본 너비 */
    margin: 0 auto;
    padding: 0 20px; /* 좌우 여백 추가 */
  }

  /* lg 크기(1200px) 이상일 때만 66.666667% 너비 적용 */
  @media (min-width: 1200px) {
    .header-content {
      width: 66.666667%;
    }
  }

  /* md 크기(960px) 이하에서 네비게이션 항목 조정 */
  @media (max-width: 960px) {
    #nav a {
      font-size: 16px;
      margin-left: 8px;
      margin-right: 2px;
    }
  }

  /* sm 크기(600px) 이하에서 추가 조정 */
  @media (max-width: 600px) {
    #nav a {
      font-size: 14px;
      margin-left: 4px;
    }

    .v-btn {
      min-width: auto;
      padding: 0 8px;
    }
  }

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

  .v-toolbar #nav a,
  #nav a {
    font-weight: bold;
    font-size: 20px;
    color: #2c3e50;
    margin-left: 15px;
    margin-right: 3px;
    text-decoration: none;
    position: relative;
    display: inline-block;
  }

  .v-toolbar #nav a::after,
  #nav a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #42b983;
    transition: width 0.3s ease;
  }

  .v-toolbar #nav a:hover::after,
  #nav a:hover::after {
    width: 100%;
  }

  .v-toolbar #nav a.router-link-active,
  #nav a.router-link-active {
    color: #42b983;
  }

  .v-toolbar #nav a.router-link-active::after,
  #nav a.router-link-active::after {
    width: 100%;
  }
</style>
