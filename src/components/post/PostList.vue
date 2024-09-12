<template>
  <v-sheet class="pa-16">
    <v-data-table
      :headers="headers"
      hide-default-footer
      item-key="index"
      :items="postsWithIndex"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="text-left">자유 게시판</v-toolbar-title>
        </v-toolbar>
      </template>

      <template #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td style="padding-right: 35px">
            {{ item.freeCategoryName }}
          </td>
          <td class="text-start">{{ item.title }}</td>
          <td style="padding-right: 35px">{{ item.viewCnt }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
          <td style="padding-right: 35px">{{ item.nickname }}</td>
        </tr>
      </template>

      <template #item.action="{ item }">
        <v-icon @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <template #footer>
        <v-pagination
          v-model="pagination.page"
          circle
          :length="pagination.pages"
        ></v-pagination>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { getPosts } from '@/apis/free/freePostService';

const searchDto = {
  startDate: '',
  endDate: '',
  categoryId: 2,
  keyword: '',
  page: 0,
  recordSize: 0,
  pageSize: 0,
};

const headers = [
  { title: '번호', align: 'start', width: '5%', key: 'index' },
  { title: '분류', align: 'center', width: '5%', key: 'freeCategoryName' },
  { title: '제목', align: 'start', width: '60%', key: 'title' },
  { title: '조회', align: 'center', width: '10%', key: 'viewCnt' },
  { title: '등록일시', align: 'center', width: '10%', key: 'createdDate' },
  { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
];
const posts = ref([]);
const pagination = ref({});
const postsWithIndex = computed(() => {
  return posts.value.map((posts, index) => ({
    ...posts,
    index:
      pagination.value.totalRecordCount -
      (searchDto.page - 1) * searchDto.pageSize -
      index,
  }));
});

onMounted(() => {
  getPosts(searchDto).then(res => {
    posts.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
});

/**
 * 나중에 쓸 watch 함수 예제
 */
// watch(
//   () => signupRequest.value.loginId,
//   value => {
//     loginIdAlredyExists.value = ['아이디 중복 확인중...'];
//     const checkDuplicateRequest = ref({
//       loginId: value,
//     });
//     const res = checkDuplicate(checkDuplicateRequest.value);
//     if (value !== signupRequest.value.loginId) return;
//     if (res.message === 'Not Duplicate') {
//       loginIdAlredyExists.value = [];
//     } else {
//       loginIdAlredyExists.value = ['중복된 아이디 입니다.'];
//     }
//   }
// );
</script>
