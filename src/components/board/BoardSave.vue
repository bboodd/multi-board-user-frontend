<template>
  <PostWrite :category-list="categoryList" @save-post="handleSavePost" />
</template>

<script setup>
import { getCategories } from '@/apis/categoryService';
import { savePost } from '@/apis/postService';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const boardType = route.path.split('/')[1];

const categoryList = ref([]);

const handleSavePost = formData => {
  savePost(boardType, formData).then(() => {
    router.push({ path: `/${boardType}` });
  });
};

onMounted(() => {
  getCategories(boardType).then(res => {
    categoryList.value = res;
  });
});
</script>
