<template>
  <PostSearch
    :category-list="categoryList"
    :search-dto="searchDto"
    @search-post="searchPost"
  />
  <PostList
    :pagination="pagination"
    :post-list="postList"
    :search-dto="searchDto"
  />
  <PostPaging
    :pagination="pagination"
    :search-dto="searchDto"
    @move-page="movePage"
  />
</template>

<script setup>
import _ from 'lodash';
import { getCategories } from '@/apis/free/freeCategoryService';
import { getPosts } from '@/apis/free/freePostService';

const now = ref(new Date());
const aMonthAgo = computed(() => {
  const date = new Date();
  return new Date(date.setMonth(date.getMonth() - 1));
});

const searchDto = ref({
  startDate: aMonthAgo.value,
  endDate: now.value,
  categoryId: 0,
  keyword: '',
  page: 1,
  recordSize: 10,
  pageSize: 10,
  orderBy: 'created_date',
  sort: 'DESC',
});

const categoryList = ref([]);
const postList = ref([]);
const pagination = ref({});

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

onMounted(() => {
  getCategories().then(res => {
    categoryList.value = res.data;
  });

  getPosts(searchDto.value).then(res => {
    postList.value = res.data.listDto;
    pagination.value = res.data.paginationDto;
  });
});
</script>
