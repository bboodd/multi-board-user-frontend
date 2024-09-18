<template>
  <PostWrite :category-list="categoryList" />
</template>

<script setup>
import { getCategories } from '@/apis/free/freeCategoryService';

const categoryList = ref([]);

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });
});
</script>
