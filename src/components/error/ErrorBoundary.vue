<template>
  <ErrorFallBack v-if="isError" :error="error" />
  <slot v-else></slot>
</template>

<script setup>
import { onErrorCaptured, ref } from 'vue';
import ErrorFallBack from './ErrorFallBack.vue';

const isError = ref(false);

const error = ref(null);

onErrorCaptured(e => {
  isError.value = true;
  error.value = e;
  return false;
});
</script>
