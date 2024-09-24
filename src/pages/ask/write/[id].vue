<template>
  <PostWrite :post="post" @download="download" @on-update="onUpdate" />
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getPost, updatePost } from '@/apis/postService';
import router from '@/router';

const route = useRoute();
const postId = route.params.id;
const boardType = route.path.split('/')[1];

const post = ref({});

const onUpdate = formData => {
  updatePost(boardType, postId, formData).then(() => {
    router.push({
      path: `/ask/${postId}`,
      query: route.query,
    });
  });
};

onMounted(() => {
  getPost(boardType, postId).then(res => {
    post.value = res.data;
  });
});
</script>
