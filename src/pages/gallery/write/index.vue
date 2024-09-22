<template>
  <PostWrite :category-list="categoryList" @on-save="onSave" />
</template>

<script setup>
import { getCategories } from '@/apis/gallery/galleryCategoryService';
import { savePost } from '@/apis/gallery/galleryPostService';
import router from '@/router';

const categoryList = ref([]);

const onSave = formData => {
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  savePost(formData).then(() => {
    router.push({ path: `/gallery` });
  });
};

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });
});
</script>
