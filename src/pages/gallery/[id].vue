<template>
  <PostDetail :file-list="fileList" :img-url-list="imgUrlList" :post="post" />
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
import { getFileList } from '@/apis/fileService';
import { getPost } from '@/apis/postService';
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
const fileList = ref([]);

const imgUrlList = ref([
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/cards/hotel.jpg',
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
  },
]);

const listBtn = () => {
  router.push({
    path: `/gallery`,
    query: route.query,
  });
};

const deleteBtn = () => {};

const updateBtn = () => {
  router.push({
    path: `/gallery/write/${postId}`,
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
  getFileList(boardType, postId).then(res => {
    fileList.value = res.data;
  });
});
</script>
