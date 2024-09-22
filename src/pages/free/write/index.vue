<template>
  <PostWrite :category-list="categoryList" @on-save="onSave" />
</template>

<script setup>
import { getCategories } from '@/apis/free/freeCategoryService';
import { savePost } from '@/apis/free/freePostService';
import router from '@/router';

const categoryList = ref([]);

const onSave = formData => {
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  savePost(formData).then(() => {
    router.push({ path: `/free` });
  });
};

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });
});
</script>
