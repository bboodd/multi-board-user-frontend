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
        <v-btn @click="loginPage">
          <span>로그인 / 회원가입</span>
        </v-btn>
      </v-toolbar>
    </nav>
  </header>
  <hr />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const loginPage = () => {
  router.push({ path: '/login' });
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
