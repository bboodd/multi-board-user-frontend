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
        <router-link to="/notice"> 공지사항 </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link to="/free"> 자유 게시판 </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link to="/gallery"> 갤러리 </router-link>
        <v-divider
          class="ms-3 border-opacity-75"
          color="gray"
          vertical
        ></v-divider>

        <router-link to="/ask"> 문의 게시판 </router-link>

        <v-spacer></v-spacer>

        <div v-if="!nickname" flat>
          <v-btn right @click="loginBtn">
            <span>로그인 / 회원가입</span>
            <v-icon icon="mdi-login-variant" right />
          </v-btn>
        </div>

        <div v-else flat style="margin-top: 20px">
          <v-toolbar-title style="float: left; font-size: 20px">
            <span>{{ nickname }}님 안녕하세요</span>
          </v-toolbar-title>
          <!-- <v-spacer></v-spacer> -->
          <v-btn flat @click="logoutBtn">
            <span style="margin-bottom: 7px"></span>
            <v-icon icon="mdi-logout-variant" right />
          </v-btn>
        </div>
      </v-toolbar>
    </nav>
  </header>
  <hr />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { nickname } = storeToRefs(authStore);

const router = useRouter();

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

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
