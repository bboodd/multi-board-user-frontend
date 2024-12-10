<script setup>
import { onErrorCaptured, provide } from 'vue';

provide('layout', {
  hasHeader: true,
  hasFooter: true,
});

// 레이아웃 레벨 에러 핸들링
onErrorCaptured(error => {
  console.error('Layout Error:', error);
  return true; // 상위로 에러 전파
});
</script>

<template>
  <v-main class="app-layout">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade">
          <keep-alive>
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </v-main>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 20px;
}

/* 페이지 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
