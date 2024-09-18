<template>
  <v-sheet class="pa-16 pt-8">
    <v-data-table
      :headers="headers"
      hide-default-footer
      item-key="index"
      :items="postListWithIndex"
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

      <template #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td style="padding-right: 35px">
            {{ item.categoryName }}
          </td>
          <td class="text-start text-h6">
            <span class="clickable-title" @click="titleClick(item.postId)">{{
              item.title
            }}</span>
          </td>
          <!-- <td class="text-start text-h6" @click="goDetail">{{ item.title }}</td> -->
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

const headers = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '5%', key: 'categoryName' },
  { title: '제목', align: 'start', width: '60%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCnt' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdDate' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];

const postListWithIndex = computed(() => {
  return props.postList.map((postList, index) => ({
    ...postList,
    index:
      props.pagination.totalRecordCount -
      (props.searchDto.page - 1) * props.searchDto.pageSize -
      index,
  }));
});

const titleClick = postId => {
  emit('goDetail', postId);
};

onMounted(() => {});
onUpdated(() => {});
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
