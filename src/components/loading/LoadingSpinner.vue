<script setup>
  const SPINNER_SIZE = '48px';
</script>

<template>
  <dialog class="loading-dialog" open>
    <div class="spinner" :style="{ '--square-size': SPINNER_SIZE }"></div>
  </dialog>
</template>

<style scoped>
  .loading-dialog {
    outline: none;
    border: none;
    background: transparent;

    /* 중앙 정렬을 위한 스타일 추가 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;

    --square-size: 48px;

    width: var(--square-size);
    height: var(--square-size);

    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;

    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
