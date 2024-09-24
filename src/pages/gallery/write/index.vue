<template>
  <PostWrite :category-list="categoryList" @on-save="onSave" />
</template>

<script setup>
import { getCategories } from '@/apis/categoryService';
import { savePost } from '@/apis/postService';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const boardType = route.path.split('/')[1];

const categoryList = ref([]);

const onSave = formData => {
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  savePost(boardType, formData).then(() => {
    router.push({ path: `/gallery` });
  });
};

onMounted(() => {
  getCategories(boardType).then(res => {
    categoryList.value = res.data;
  });
});
</script>
