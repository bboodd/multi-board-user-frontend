<script setup>
  import { getCategories } from '@/apis/categoryService';
  import { savePost } from '@/apis/postService';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const boardType = route.path.split('/')[1];

  const state = ref({
    categoryList: [],
    isSubmitting: false,
  });

  const handleSavePost = async formData => {
    if (state.value.isSubmitting) return;

    state.value.isSubmitting = true;
    await savePost(boardType, formData);
    router.push({
      path: `/${boardType}`,
      query: route.query,
    });
  };

  onMounted(async () => {
    const categories = await getCategories(boardType);
    state.value.categoryList = categories.data;
  });
</script>

<template>
  <div class="post-create-container">
    <PostWrite
      :category-list="state.categoryList"
      :is-submitting="state.isSubmitting"
      @save-post="handleSavePost"
    />
  </div>
</template>

<style scoped>
  .post-create-container {
    width: 100%;
  }
</style>
