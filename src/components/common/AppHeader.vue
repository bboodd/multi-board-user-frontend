<!-- PageHeader.vue -->
<template>
  <header>
    <h1 id="nav">
      <router-link to="/"
        ><span style="font-size: 30px"> 다중 게시판 </span></router-link
      >
    </h1>
    <nav>
      <v-toolbar id="nav" app color="white" flat>
        <router-link
          :class="{ 'router-link-active': isActive('/notice') }"
          to="/notice"
        >
          공지사항
        </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link
          :class="{ 'router-link-active': isActive('/free') }"
          to="/free"
        >
          자유 게시판
        </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link
          :class="{ 'router-link-active': isActive('/gallery') }"
          to="/gallery"
        >
          갤러리
        </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link
          :class="{ 'router-link-active': isActive('/ask') }"
          to="/ask"
        >
          문의 게시판
        </router-link>

        <v-spacer></v-spacer>

        <div v-if="!nickname" flat>
          <v-btn right @click="loginBtn">
            <span>로그인 / 회원가입</span>
            <v-icon icon="mdi-login-variant" right />
          </v-btn>
        </div>

        <div v-else flat style="margin-top: 20px">
          <v-toolbar-title style="float: left; font-size: 15px">
            <span>{{ nickname }}님 안녕하세요</span>
          </v-toolbar-title>
          <v-btn flat @click="logoutBtn">
            <span style="margin-bottom: 7px">로그아웃</span>
            <v-icon class="mb-2" icon="mdi-logout-variant" right />
          </v-btn>
        </div>
      </v-toolbar>
    </nav>
  </header>
  <hr />
</template>

<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();

const authStore = useAuthStore();
const { nickname } = storeToRefs(authStore);

const isActive = basePath => {
  return route.path.startsWith(basePath);
};

const loginBtn = () => {
  router.push({ path: '/login' });
};

const logoutBtn = () => {
  authStore.logout();
};
</script>

<style scoped>
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
