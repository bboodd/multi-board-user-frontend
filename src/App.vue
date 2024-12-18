<script setup>
  import { onErrorCaptured } from 'vue';

  // 전역 에러 핸들링
  onErrorCaptured(error => {
    console.error('App Error:', error);
    // 에러 로깅 서비스로 전송
    return false;
  });
</script>

<template>
  <v-app>
    <ErrorBoundary>
      <Suspense>
        <router-view />
        <template #fallback>
          <LoadingSpinner class="full-page-loader" />
        </template>
      </Suspense>
    </ErrorBoundary>
  </v-app>
</template>

<style>
  :root {
    --primary-color: #2c3e50;
    --font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  #app {
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--primary-color);
  }

  .full-page-loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
