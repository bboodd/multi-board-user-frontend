<template>
  <v-sheet class="pa-16 pb-0">
    <v-row class="border-md pb-0 pt-6 pl-2 pr-2" dense>
      <span style="float: left; margin-top: 18px; padding-left: 10px"
        >등록일시</span
      >
      <v-col cols="2" md="2">
        <v-date-input
          v-model="searchDto.startDate"
          class="pl-5 pr-5"
          label="시작일"
          :max="searchDto.endDate"
          :min="aYearAgo"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
        ></v-date-input>
      </v-col>

      <span style="float: left; margin-top: 18px">~</span>
      <v-col cols="2" md="2">
        <v-date-input
          v-model="searchDto.endDate"
          class="pl-5 pr-5"
          label="종료일"
          :max="searchDto.endDate"
          :min="searchDto.startDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
        >
        </v-date-input>
      </v-col>

      <v-col cols="2" md="2">
        <v-select
          v-model="selectCategory"
          class="pl-5 pr-5"
          item-title="categoryName"
          item-value="categotyId"
          :items="categoryList"
          label="분류"
          variant="outlined"
        >
        </v-select>
      </v-col>

      <v-col cols="4" md="4">
        <v-text-field
          v-model="searchDto.keyword"
          class="pl-5 pr-5"
          label="제목 or 내용"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="1" md="1">
        <v-btn block class="pl-5 pr-5" color="primary" size="x-large"
          >검색</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="">
      <v-col cols="1" md="1">
        <v-select
          v-model="selectRecordSize"
          item-title="recordSize"
          item-value="recordSize"
          :items="recordSizeList"
          label="페이지 당"
          variant="outlined"
        ></v-select>
      </v-col>
      <span style="margin-top: 30px">개씩 보기</span>

      <v-spacer></v-spacer>
      <span style="margin-top: 30px">정렬</span>
      <v-col cols="2" md="2">
        <v-select
          v-model="selectOrderBy"
          item-title="orderByName"
          item-value="orderBy"
          :items="orderByList"
          label="기준"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="2" md="2">
        <v-select
          v-model="selectSort"
          item-title="sortName"
          item-value="sort"
          :items="sortList"
          label="방법"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { getCategoryList } from '@/apis/free/freeCategoryService';
const now = ref(new Date());
const aMonthAgo = computed(() => {
  const date = new Date();
  return new Date(date.setMonth(date.getMonth() - 1));
});
const aYearAgo = computed(() => {
  const date = new Date();
  return new Date(date.setFullYear(date.getFullYear() - 1));
});
const selectCategory = ref({
  categoryName: '전체분류',
  categoryId: 0,
});

const selectRecordSize = ref({
  recordSize: 10,
});

const selectOrderBy = ref({
  orderByName: '등록일시',
  orderBy: 'created_date',
});

const selectSort = ref({
  sortName: '내림차순',
  sort: 'DESC',
});

const searchDto = ref({
  startDate: new Date(aMonthAgo.value),
  endDate: new Date(now.value),
  categoryId: selectCategory.value.categoryId,
  keyword: '',
  page: 1,
  pageSize: selectRecordSize.value,
  recordSize: 10,
});
const categoryList = ref();

const recordSizeList = ref([
  { recordSize: 10 },
  { recordSize: 20 },
  { recordSize: 30 },
]);

const orderByList = ref([
  { orderByName: '등록일시', orderBy: 'created_date' },
  { orderByName: '분류', orderBy: 'categoryId' },
  { orderByName: '제목', orderBy: 'title' },
  { orderByName: '조회수', orderBy: 'view_cnt' },
]);

const sortList = ref([
  { sortName: '내림차순', sort: 'DESC' },
  { sortName: '오름차순', sort: 'ASC' },
]);

onMounted(() => {
  getCategoryList().then(res => {
    console.log(res);
    categoryList.value = res.data;
  });
});
</script>

<style scoped></style>
