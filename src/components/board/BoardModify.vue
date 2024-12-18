<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { getCategories } from '@/apis/categoryService';
  import { downloadFile } from '@/apis/fileService';
  import { getPost, updatePost } from '@/apis/postService';

  const route = useRoute();
  const router = useRouter();

  const postId = route.params.id;
  const boardType = route.path.split('/')[1];

  // 상태 관리
  const state = ref({
    categoryList: [],
    post: {},
    fileList: [],
    isSubmitting: false,
  });

  // 데이터 로드 함수
  const fetchData = async () => {
    const [categories, postData] = await Promise.all([
      getCategories(boardType),
      getPost(boardType, postId),
    ]);

    state.value = {
      categoryList: categories.data,
      post: postData.data,
      fileList: postData.data.files,
    };
  };

  const onUpdatePost = async formData => {
    if (state.value.isSubmitting) return;

    state.value.isSubmitting = true;
    await updatePost(boardType, postId, formData);
    router.push({
      path: `/${boardType}/${postId}`,
      query: route.query,
    });
  };

  const download = (postId, fileId, originalName) => {
    downloadFile(postId, fileId, originalName);
  };

  onMounted(fetchData);
</script>
<template>
  <div class="post-update-container">
    <PostWrite
      :category-list="state.categoryList"
      :file-list="state.fileList"
      :is-submitting="state.isSubmitting"
      :post="state.post"
      @download="download"
      @update-post="onUpdatePost"
    />
  </div>
</template>

<style scoped>
  .post-update-container {
    width: 100%;
  }
</style>
