<template>
  <PostWrite @on-save="onSave" />
</template>

<script setup>
import { savePost } from '@/apis/postService';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const boardType = route.path.split('/')[1];

const onSave = formData => {
  savePost(boardType, formData).then(() => {
    router.push({ path: `/ask` });
  });
};
</script>
