<template>
  <PostWrite
    :category-list="categoryList"
    :file-list="fileList"
    :post="post"
    :post-id="postId"
  />
</template>
<script setup>
import { useRoute } from 'vue-router';
import { getCategories } from '@/apis/free/freeCategoryService';
import { getFileList } from '@/apis/free/freeFileService';
import { getPost } from '@/apis/free/freePostService';

const route = useRoute();

const postId = route.params.id;

const categoryList = ref([]);
const post = ref({});
const fileList = ref([]);

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });
  getPost(postId).then(res => {
    post.value = res.data;
  });
  getFileList(postId).then(res => {
    fileList.value = res.data;
  });
});
</script>
