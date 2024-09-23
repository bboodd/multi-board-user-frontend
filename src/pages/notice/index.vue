<template>
  <PostSearch
    :category-list="categoryList"
    :search-dto="searchDto"
    @emit-sort="emitSort"
    @search-post="searchPost"
  />
  <PostList
    :fin-post-list="finPostList"
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
import _ from 'lodash';
import { getCategories } from '@/apis/notice/noticeCategoryService';
import { getFinPosts, getPosts } from '@/apis/notice/noticePostService';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const aMonthAgo = computed(() => {
  const date = new Date();
  return new Date(date.setMonth(date.getMonth() - 1));
});

const searchDto = ref({
  startDate: route.query?.startDate
    ? new Date(route.query.startDate)
    : aMonthAgo.value,
  endDate: route.query?.endDate ? new Date(route.query.endDate) : '',
  categoryId: route.query?.categoryId ? parseInt(route.query.categoryId) : 0,
  keyword: route.query.keyword ?? '',
  page: route.query?.page ? parseInt(route.query.page) : 1,
  recordSize: route.query?.recordSize ? parseInt(route.query.recordSize) : 10,
  pageSize: route.query?.pageSize ? parseInt(route.query.pageSize) : 10,
  orderBy: route.query.orderBy ?? 'createdDate',
  sortBy: route.query.sortBy ?? 'desc',
});

const categoryList = ref([]);
const postList = ref([]);
const pagination = ref({});
const finPostList = ref([]);

/**
 * 검색 함수
 * @param changeSearch - 검색 정보
 */
const searchPost = changeSearch => {
  _.assign(searchDto.value, changeSearch);

  getPosts(searchDto.value).then(res => {
    postList.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
};

/**
 * 페이지 이동 함수
 * @param changePage - 페이지 번호
 */
const movePage = changePage => {
  searchDto.value.page = changePage;

  getPosts(searchDto.value).then(res => {
    postList.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
};

/**
 * 검색 조건 변경 후 데이터 렌더링 함수
 * @param sortCondition - 검색 조건 정보
 */
const emitSort = sortCondition => {
  _.assign(searchDto.value, sortCondition);

  getPosts(searchDto.value).then(res => {
    postList.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
};

const goDetail = postId => {
  router.push({
    path: `/notice/${postId}`,
    query: searchDto.value,
  });
};

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });
  getPosts(searchDto.value).then(res => {
    postList.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
  getFinPosts().then(res => {
    finPostList.value = res.data;
  });
});
</script>
