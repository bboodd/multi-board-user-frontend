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
import { getCategories } from '@/apis/gallery/galleryCategoryService';
import { downloadFile, getFileList } from '@/apis/gallery/galleryFileService';
import { getPost, updatePost } from '@/apis/gallery/galleryPostService';
import router from '@/router';

const route = useRoute();

const postId = route.params.id;

const categoryList = ref([]);
const post = ref({});
const fileList = ref([]);

const onUpdate = formData => {
  updatePost(postId, formData).then(() => {
    router.push({
      path: `/gallery/${postId}`,
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
