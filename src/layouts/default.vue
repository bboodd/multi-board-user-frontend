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
      <v-container class="pa-0" fluid>
        <v-row no-gutters>
          <!-- 왼쪽 사이드바: lg 이상에서만 표시 -->
          <v-col cols="0" lg="2">
            <v-sheet class="left-aside"></v-sheet>
          </v-col>

          <!-- 메인 컨텐츠: 작은 화면에서는 12칸 사용 -->
          <v-col cols="12" lg="8">
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="fade">
                <keep-alive>
                  <component :is="Component" :key="$route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </v-col>

          <!-- 오른쪽 사이드바: lg 이상에서만 표시 -->
          <v-col cols="0" lg="2">
            <v-sheet class="right-aside"></v-sheet>
          </v-col>
        </v-row>
      </v-container>
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

  .content-container {
    max-width: 1600px; /* 최대 너비 설정 */
    margin: 0 auto; /* 가운데 정렬 */
  }

  .content-column {
    padding: 0 20px; /* 좌우 패딩 추가 */
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
