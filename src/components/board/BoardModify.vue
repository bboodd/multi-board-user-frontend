<template>
  <PostWrite
    :category-list="categoryList"
    :file-list="fileList"
    :post="post"
    @download="download"
    @update-post="onUpdatePost"
  />
</template>
<script setup>
import { useRoute } from 'vue-router';
import { getCategories } from '@/apis/categoryService';
import { downloadFile, getFileList } from '@/apis/fileService';
import { getPost, updatePost } from '@/apis/postService';
import router from '@/router';

const route = useRoute();
const postId = route.params.id;
const boardType = route.path.split('/')[1];

const categoryList = ref([]);
const post = ref({});
const fileList = ref([]);

const onUpdatePost = formData => {
  updatePost(boardType, postId, formData).then(() => {
    router.push({
      path: `/${boardType}/${postId}`,
      query: route.query,
    });
  });
};

const download = (postId, fileId, originalName) => {
  downloadFile(boardType, postId, fileId, originalName);
};

onMounted(() => {
  getCategories(boardType).then(res => {
    categoryList.value = res.data;
  });
  getPost(boardType, postId).then(res => {
    post.value = res.data;
  });
  getFileList(boardType, postId).then(res => {
    fileList.value = res.data;
  });
});
</script>
