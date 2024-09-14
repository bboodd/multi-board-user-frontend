<template>
  <PostDetail :post="post" />
  <v-row class="pa-6">
    <v-col>
      <v-btn
        class="mr-6"
        color="indigo"
        size="large"
        width="100"
        @click="listBtn"
        >목록</v-btn
      >
      <v-btn
        class="mr-6"
        color="blue-grey"
        size="large"
        width="100"
        @click="deleteBtn"
        >삭제</v-btn
      >
      <v-btn
        class="mr-6"
        color="blue-grey"
        size="large"
        width="100"
        @click="updateBtn"
        >수정</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
import { getPost } from '@/apis/free/freePostService';
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { nickname } = storeToRefs(authStore);

const updateAndDeleteBtnFlag = computed(() => {
  if (nickname === post.value.nickname) {
    return true;
  } else {
    return false;
  }
});

const route = useRoute();

const postId = route.params.id;

const post = ref({});

const listBtn = () => {};

const deleteBtn = () => {};

const updateBtn = () => {};

onMounted(() => {
  getPost(postId).then(res => {
    post.value = res.data;
  });
});
</script>
