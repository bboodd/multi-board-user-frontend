<template>
  <PostWrite :post="post" @download="download" @on-update="onUpdate" />
</template>
<script setup>
import { useRoute } from 'vue-router';
import { getPost, updatePost } from '@/apis/ask/askPostService';
import router from '@/router';

const route = useRoute();

const postId = route.params.id;

const post = ref({});

const onUpdate = formData => {
  updatePost(postId, formData).then(() => {
    router.push({
      path: `/ask/${postId}`,
      query: route.query,
    });
  });
};

onMounted(() => {
  getPost(postId).then(res => {
    post.value = res.data;
  });
});
</script>
