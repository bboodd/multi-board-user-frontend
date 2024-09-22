<template>
  <PostWrite
    :category-list="categoryList"
    :file-list="fileList"
    :post="post"
    @download="download"
    @on-update="onUpdate"
  />
</template>
<script setup>
import { useRoute } from 'vue-router';
import { getCategories } from '@/apis/free/freeCategoryService';
import { downloadFile, getFileList } from '@/apis/free/freeFileService';
import { getPost, updatePost } from '@/apis/free/freePostService';
import router from '@/router';

const route = useRoute();

const postId = route.params.id;

const categoryList = ref([]);
const post = ref({});
const fileList = ref([]);

const onUpdate = formData => {
  updatePost(postId, formData).then(() => {
    router.push({
      path: `/free/${postId}`,
      query: route.query,
    });
  });
};

const download = (postId, fileId, originalName) => {
  downloadFile(postId, fileId, originalName);
};

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
