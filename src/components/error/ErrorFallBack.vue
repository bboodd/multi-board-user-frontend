<script setup>
defineProps({
  error: {
    type: Error,
    required: true,
  },
  errorInfo: {
    type: String,
    default: '',
  },
  componentStack: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['reset']);

const handleReset = () => {
  emit('reset');
};
</script>

<template>
  <div class="error-fallback">
    <div class="error-content">
      <h2 class="error-title">오류가 발생했습니다</h2>

      <div class="error-details">
        <p class="error-message">
          {{ error.message }}
        </p>

        <div v-if="componentStack" class="error-location">
          발생 위치: {{ componentStack }}
        </div>

        <div v-if="errorInfo" class="error-info">
          {{ errorInfo }}
        </div>
      </div>

      <v-btn class="reset-button" color="primary" @click="handleReset">
        다시 시도
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.error-fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px;
}

.error-content {
  max-width: 600px;
  text-align: center;
}

.error-title {
  color: #d32f2f;
  margin-bottom: 20px;
}

.error-details {
  margin-bottom: 24px;
  text-align: left;
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}

.error-message {
  font-weight: bold;
  margin-bottom: 12px;
}

.error-location,
.error-info {
  font-size: 0.9em;
  color: #666;
  margin-top: 8px;
}

.reset-button {
  margin-top: 16px;
}
</style>
