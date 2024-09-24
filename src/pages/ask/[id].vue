<template>
  <PostDetail :post="post" />
  <PostComment :comment-list="commentList" />
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
        v-show="updateAndDeleteBtnFlag"
        class="mr-6"
        color="red"
        size="large"
        width="100"
        @click="deleteBtn"
        >삭제</v-btn
      >
      <v-btn
        v-show="updateAndDeleteBtnFlag"
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
import { getPost } from '@/apis/postService';
import { getCommentList } from '@/apis/commentService';
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const { nickname } = storeToRefs(authStore);

const route = useRoute();
const postId = route.params.id;
const boardType = route.path.split('/')[1];

const post = ref({});
const commentList = ref([]);

const listBtn = () => {
  router.push({
    path: `/ask`,
    query: route.query,
  });
};

const deleteBtn = () => {};

const updateBtn = () => {
  router.push({
    path: `/ask/write/${postId}`,
    query: route.query,
  });
};

/**
 * 수정 및 삭제 버튼 로그인시만 나오게 하는 변수
 */
const updateAndDeleteBtnFlag = computed(() => {
  return nickname.value === post.value?.nickname;
});

onMounted(() => {
  getPost(boardType, postId).then(res => {
    post.value = res.data;
  });
  getCommentList(boardType, postId).then(res => {
    commentList.value = res.data;
  });
});
</script>
