<template>
  <PostSearch
    :category-list="categoryList"
    :search-dto="searchDto"
    @emit-sort="emitSort"
    @search-post="searchPost"
  />
  <v-row v-if="boardType !== 'notice'" class="pr-3">
    <v-spacer></v-spacer>
    <v-btn class="mr-16" color="primary" size="large" @click="writeBtn"
      >글 등록</v-btn
    >
  </v-row>
  <PostList
    :pagination="pagination"
    :post-list="postList"
    :search-dto="searchDto"
    @go-detail="goDetail"
  />
  <PostPaging
    :pagination="pagination"
    :search-dto="searchDto"
    @move-page="movePage"
  />
</template>

<script setup>
import * as lodash from 'lodash';
import { getCategories } from '@/apis/categoryService';
import { getPosts } from '@/apis/postService';
import router from '@/router';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

const route = useRoute();
const boardType = route.path.split('/')[1];

const aMonthAgo = computed(() => {
  return dayjs().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss');
});

const searchDto = ref({
  startDate: route.query?.startDate
    ? dayjs(route.query.startDate).format('YYYY-MM-DDTHH:mm:ss')
    : aMonthAgo.value,
  endDate: route.query?.endDate
    ? dayjs(route.query.endDate).format('YYYY-MM-DDTHH:mm:ss')
    : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  categoryId: route.query?.categoryId ? parseInt(route.query.categoryId) : 0,
  keyword: route.query.keyword ?? '',
  page: route.query?.page ? parseInt(route.query.page) : 1,
  size: route.query?.size ? parseInt(route.query.size) : 10,
  orderBy: route.query.orderBy ?? 'createdDate',
  sortBy: route.query.sortBy ?? 'desc',
  nickname: route.query?.nickname ?? '',
});

const categoryList = ref([]);
const postList = ref([]);
const pagination = ref({});

/**
 * 검색 함수
 * @param changeSearch - 검색 정보
 */
const searchPost = changeSearch => {
  const formattedSearch = {
    ...changeSearch,
    startDate: dayjs(changeSearch.startDate).format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs(changeSearch.endDate).format('YYYY-MM-DDTHH:mm:ss'),
  };

  lodash.assign(searchDto.value, formattedSearch);

  getPosts(boardType, searchDto.value).then(res => {
    postList.value = res.data;
    pagination.value = res.pagination;
  });
};

/**
 * 페이지 이동 함수
 * @param changePage - 페이지 번호
 */
const movePage = changePage => {
  searchDto.value.page = changePage;

  getPosts(boardType, searchDto.value).then(res => {
    postList.value = res.data;
    pagination.value = res.pagination;
  });
};

/**
 * 검색 조건 변경 후 데이터 렌더링 함수
 * @param sortCondition - 검색 조건 정보
 */
const emitSort = sortCondition => {
  lodash.assign(searchDto.value, sortCondition);

  getPosts(boardType, searchDto.value).then(res => {
    postList.value = res.data;
    pagination.value = res.pagination;
  });
};

const goDetail = postId => {
  router.push({
    path: `/${boardType}/${postId}`,
    query: searchDto.value,
  });
};

const writeBtn = () => {
  router.push({ path: `/${boardType}/write`, query: searchDto.value });
};

onMounted(() => {
  getCategories(boardType).then(res => {
    categoryList.value = res;
  });

  getPosts(boardType, searchDto.value).then(res => {
    postList.value = res.data;
    pagination.value = res.pagination;
  });
});
</script>
