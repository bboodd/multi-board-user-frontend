<template>
  <PostSearch
    :category-list="categoryList"
    :search-dto="searchDto"
    @emit-sort="emitSort"
    @search-post="searchPost"
  />
  <v-row class="pr-3">
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
import _ from 'lodash';
import { getCategories } from '@/apis/gallery/galleryCategoryService';
import { getPosts } from '@/apis/gallery/galleryPostService';
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
    path: `/gallery/${postId}`,
    query: searchDto.value,
  });
};

const writeBtn = () => {
  router.push({ path: `/gallery/write`, query: searchDto.value });

  //   router.go('/gallery/write');
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
