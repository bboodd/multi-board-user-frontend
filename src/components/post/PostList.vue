<template>
  <v-sheet class="pa-16 pt-8">
    <v-data-table
      :headers="selectHeaders(boardType)"
      hide-default-footer
      item-key="index"
      :items="
        boardType !== 'notice'
          ? postListWithIndex
          : postListWithIndexAndFinPosts
      "
      :items-per-page="props.searchDto.size"
      :no-data-text="'검색된 결과가 없습니다.'"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="text-left"
            >총 {{ props.pagination?.totalCount ?? 0 }}건</v-toolbar-title
          >
        </v-toolbar>
      </template>

      <template v-if="boardType === 'free'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td style="padding-right: 35px">
            {{ item.categoryName }}
          </td>
          <td class="text-start text-body-1">
            <span class="clickable-title" @click="titleClick(item.id)">{{
              item.title +
              ' ' +
              (item.commentCount ? '(' + item.commentCount + ')' : '')
            }}</span>
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.fileCount"
              class="ml-1"
              icon="mdi-paperclip"
              size="small"
            ></v-icon>
          </td>
          <td style="padding-right: 35px">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'gallery'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td style="padding-right: 35px">
            {{ item.categoryName }}
          </td>
          <td class="border-md">
            <v-img
              v-if="thumbnailUrls[item.id]"
              class="float-left clickable-title"
              height="150"
              :src="thumbnailUrls[item.id]"
              width="250"
              @click="titleClick(item.id)"
            >
              <template #placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular
                    color="grey-lighten-5"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <v-skeleton-loader
              v-else
              class="float-left"
              height="150"
              type="image"
              width="250"
            ></v-skeleton-loader>
            <div
              class="float-left text-start pa-10 clickable-title"
              @click="titleClick(item.id)"
            >
              <div class="text-h6">
                <strong>{{
                  item.title +
                  ' ' +
                  (item.fileCount ? '+(' + item.fileCount + ')' : '')
                }}</strong>
                <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
                  >new</span
                >
              </div>
              <div class="text-body-1">{{ item.content }}</div>
            </div>
          </td>
          <td style="padding-right: 35px">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'qna'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td class="text-start text-body-1">
            <span
              class="clickable-title"
              @click="titleClick(item.id, item.locked, item.nickname)"
              >{{
                item.title +
                ' ' +
                '(' +
                (item.commentCount ? '답변완료' : '미답변') +
                ')'
              }}</span
            >
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.locked"
              class="ml-1"
              icon="mdi-lock"
              size="small"
            ></v-icon>
          </td>
          <td style="padding-right: 35px">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'notice'" #item="{ item }">
        <tr :class="item.index ? '' : 'bg-pink-lighten-5'">
          <td class="text-start">{{ item.index }}</td>
          <td style="padding-right: 35px">
            {{ item.categoryName }}
          </td>
          <td class="text-start text-body-1">
            <span class="clickable-title" @click="titleClick(item.id)">{{
              item.title
            }}</span>
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
          </td>
          <td style="padding-right: 35px">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getThumbnail } from '@/apis/fileService';
// import * as lodash from 'lodash';

const route = useRoute();
const boardType = route.path.split('/')[1];

const props = defineProps({
  searchDto: {
    type: Object,
    default: () => {
      return {};
    },
  },
  postList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  pagination: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emit = defineEmits(['goDetail']);

const selectHeaders = board => {
  if (board === 'free' || board === 'notice') {
    return freeHeaders;
  }
  if (board === 'gallery') {
    return galleryHeaders;
  }
  if (board === 'qna') {
    return qnaHeaders;
  }
};

const freeHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '7.5%', key: 'categoryName' },
  { title: '제목', align: 'start', width: '57.5%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const galleryHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '5%', key: 'categoryName' },
  { title: '', align: 'start', width: '60%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const qnaHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '제목', align: 'start', width: '65%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const weekAgo = computed(() => {
  const date = new Date();
  return new Date(date.setDate(date.getDate() - 7));
});

const postListWithIndex = computed(() => {
  if (!props.postList.length) return;
  return props.postList.map((postList, index) => ({
    ...postList,
    index:
      props.pagination.totalCount -
      (props.searchDto.page - 1) * props.searchDto.size -
      index,
  }));
});

const newFlag = createdAt => {
  return new Date(createdAt) > weekAgo.value;
};

const postListWithIndexAndFinPosts = computed(() => {
  if (!props.postList.length) return;
  const postAndIndex = props.postList.map((postList, index) => ({
    ...postList,
    index:
      props.pagination.totalCount -
      (props.searchDto.page - 1) * props.searchDto.size -
      index,
  }));

  const finPostList = props.postList.filter(post => post.fixed === true);
  return finPostList.concat(postAndIndex);
});

const titleClick = (postId, locked, nickname) => {
  const authStore = useAuthStore();
  if (locked && nickname !== authStore.nickname) {
    return alert('비밀 글 입니다.');
  }
  emit('goDetail', postId);
};

const thumbnailUrls = ref({});

const loadThumbnail = async postId => {
  try {
    const response = await getThumbnail(boardType, postId);
    thumbnailUrls.value = {
      ...thumbnailUrls.value,
      [postId]: response.data, // 여기서 .data 접근
    };
  } catch (error) {
    console.error('Failed to load thumbnail:', error);
    thumbnailUrls.value = {
      ...thumbnailUrls.value,
      [postId]: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg', // 기본 이미지
    };
  }
};

// postList가 변경될 때 썸네일 로드
watch(
  () => props.postList,
  async newVal => {
    if (newVal?.length) {
      for (const post of newVal) {
        if (!thumbnailUrls.value[post.id]) {
          await loadThumbnail(post.id);
          // 요청 사이에 짧은 딜레이
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.clickable-title {
  cursor: pointer;
  color: black;
}
.clickable-title:hover {
  color: cornflowerblue;
}
</style>
