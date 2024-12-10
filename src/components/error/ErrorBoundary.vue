<script setup>
import { onErrorCaptured, ref } from 'vue';
import ErrorFallBack from './ErrorFallBack.vue';

// 에러 상태 관리
const errorState = ref({
  isError: false,
  error: null,
  errorInfo: null,
  componentStack: null,
});

// 에러 초기화 함수
const resetError = () => {
  errorState.value = {
    isError: false,
    error: null,
    errorInfo: null,
    componentStack: null,
  };
};

// 에러 로깅 함수
const logError = (error, instance, info) => {
  console.error('에러 발생:', {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    componentName: instance?.type?.name || 'Unknown Component',
    errorInfo: info,
  });
};

// 에러 캡처 핸들러
onErrorCaptured((err, instance, info) => {
  // 에러 로깅
  logError(err, instance, info);

  // 에러 상태 업데이트
  errorState.value = {
    isError: true,
    error: err,
    errorInfo: info,
    componentStack: instance?.type?.name,
  };

  // 에러 전파 중단
  return false;
});
</script>

<template>
  <ErrorFallBack
    v-if="errorState.isError"
    :component-stack="errorState.componentStack"
    :error="errorState.error"
    :error-info="errorState.errorInfo"
    @reset="resetError"
  />
  <slot v-else></slot>
</template>
