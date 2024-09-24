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
      :items-per-page="props.searchDto.recordSize"
      :no-data-text="'검색된 결과가 없습니다.'"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="text-left"
            >총 {{ props.pagination?.totalRecordCount ?? 0 }}건</v-toolbar-title
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
            <span class="clickable-title" @click="titleClick(item.postId)">{{
              item.title +
              ' ' +
              (item.commentCnt ? '(' + item.commentCnt + ')' : '')
            }}</span>
            <span v-if="newFlag(item.createdDate)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.fileCnt"
              class="ml-1"
              icon="mdi-paperclip"
              size="small"
            ></v-icon>
          </td>
          <td style="padding-right: 35px">{{ item.viewCnt }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
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
              class="float-left clickable-title"
              height="150"
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              width="250"
              @click="titleClick(item.postId)"
            />
            <div
              class="float-left text-start pa-10 clickable-title"
              @click="titleClick(item.postId)"
            >
              <div class="text-h6">
                <strong>{{ item.title }}</strong>
                <span v-if="newFlag(item.createdDate)" class="ml-2 text-red"
                  >new</span
                >
              </div>
              <div class="text-body-1">{{ item.content }}</div>
            </div>
          </td>
          <td style="padding-right: 35px">{{ item.viewCnt }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'ask'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td class="text-start text-body-1">
            <span class="clickable-title" @click="titleClick(item.postId)">{{
              item.title +
              ' ' +
              '(' +
              (item.commentCnt ? '답변완료' : '미답변') +
              ')'
            }}</span>
            <span v-if="newFlag(item.createdDate)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.lockYn"
              class="ml-1"
              icon="mdi-lock"
              size="small"
            ></v-icon>
          </td>
          <td style="padding-right: 35px">{{ item.viewCnt }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
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
            <span class="clickable-title" @click="titleClick(item.postId)">{{
              item.title
            }}</span>
            <span v-if="newFlag(item.createdDate)" class="ml-2 text-red"
              >new</span
            >
          </td>
          <td style="padding-right: 35px">{{ item.viewCnt }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { useRoute } from 'vue-router';
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
  if (board === 'ask') {
    return askHeaders;
  }
};

const freeHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '7.5%', key: 'categoryName' },
  { title: '제목', align: 'start', width: '57.5%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCnt' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdDate' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const galleryHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '5%', key: 'categoryName' },
  { title: '', align: 'start', width: '60%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCnt' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdDate' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const askHeaders = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '제목', align: 'start', width: '65%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCnt' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdDate' },
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
      props.pagination.totalRecordCount -
      (props.searchDto.page - 1) * props.searchDto.pageSize -
      index,
  }));
});

const newFlag = createdDate => {
  return new Date(createdDate) > weekAgo.value;
};

const postListWithIndexAndFinPosts = computed(() => {
  if (!props.postList.length) return;
  const postAndIndex = props.postList.map((postList, index) => ({
    ...postList,
    index:
      props.pagination.totalRecordCount -
      (props.searchDto.page - 1) * props.searchDto.pageSize -
      index,
  }));

  const finPostList = props.postList.filter(post => post.finYn === true);
  return finPostList.concat(postAndIndex);
});

const titleClick = postId => {
  emit('goDetail', postId);
};
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
