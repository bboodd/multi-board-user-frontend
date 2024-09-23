<template>
  <PostWrite @on-save="onSave" />
</template>

<script setup>
import { savePost } from '@/apis/ask/askPostService';
import router from '@/router';

const onSave = formData => {
  savePost(formData).then(() => {
    router.push({ path: `/ask` });
  });
};
</script>
