<template>
  <div class="error-page">
    <h3>서비스를 불러오는데 실패했습니다.</h3>
    error >>> {{ props.error }}
    <h3>새로고침 버튼을 눌러주세요</h3>
    <button type="button" @click="refreshPage">새로고침하기</button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: String,
    default: null,
  },
});

const refreshPage = () => {
  window.location.reload();
};
</script>
