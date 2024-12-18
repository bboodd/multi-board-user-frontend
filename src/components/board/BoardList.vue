<script setup>
  import * as lodash from 'lodash';
  import { getCategories } from '@/apis/categoryService';
  import { getPosts } from '@/apis/postService';
  import { useRoute, useRouter } from 'vue-router';
  import dayjs from 'dayjs';

  // 상수 분리
  const DEFAULT_PAGE_SIZE = 10;
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

  const route = useRoute();
  const router = useRouter();
  const boardType = route.path.split('/')[1];

  // 날짜 관련 computed
  const currentDate = computed(
    () => dayjs().endOf('day').format(DATE_FORMAT) // 23:59:59로 설정
  );

  const aMonthAgo = computed(
    () => dayjs().subtract(1, 'month').startOf('day').format(DATE_FORMAT) // 00:00:00로 설정
  );

  const state = ref({
    categoryList: [],
    postList: [],
    pagination: {},
  });

  const searchDto = ref({
    startDate: route.query?.startDate
      ? dayjs(route.query.startDate).startOf('day').format(DATE_FORMAT)
      : aMonthAgo.value,
    endDate: route.query?.endDate
      ? dayjs(route.query.endDate).endOf('day').format(DATE_FORMAT)
      : currentDate.value,
    categoryId: Number(route.query?.categoryId) || 0,
    keyword: route.query.keyword ?? '',
    page: Number(route.query?.page) || 1,
    size: Number(route.query?.size) || DEFAULT_PAGE_SIZE,
    orderBy: route.query.orderBy ?? 'createdAt',
    sortBy: route.query.sortBy ?? 'desc',
    nickname: route.query?.nickname ?? '',
  });

  // API 호출 함수
  const fetchPosts = async () => {
    const res = await getPosts(boardType, searchDto.value);
    state.value.postList = res.data.data;
    state.value.pagination = res.data.pagination;
  };

  /**
   * 검색 함수
   * @param changeSearch - 검색 정보
   */
  const searchPost = async changeSearch => {
    const formattedSearch = {
      ...changeSearch,
      startDate: dayjs(changeSearch.startDate)
        .startOf('day') // 00:00:00로 설정
        .format(DATE_FORMAT),
      endDate: dayjs(changeSearch.endDate)
        .endOf('day') // 23:59:59로 설정
        .format(DATE_FORMAT),
    };

    lodash.assign(searchDto.value, formattedSearch);
    await fetchPosts();
  };

  /**
   * 페이지 이동 함수
   * @param changePage - 페이지 번호
   */
  const movePage = async changePage => {
    searchDto.value.page = changePage;
    await fetchPosts();
  };

  /**
   * 검색 조건 변경 후 데이터 렌더링 함수
   * @param sortCondition - 검색 조건 정보
   */
  const emitSort = async sortCondition => {
    lodash.assign(searchDto.value, sortCondition);
    await fetchPosts();
  };

  // 라우팅 함수
  const goDetail = postId => {
    router.push({
      path: `/${boardType}/${postId}`,
      query: searchDto.value,
    });
  };

  const writeBtn = () => {
    router.push({
      path: `/${boardType}/write`,
      query: searchDto.value,
    });
  };

  onMounted(async () => {
    const [categories, posts] = await Promise.all([
      getCategories(boardType),
      getPosts(boardType, searchDto.value),
    ]);

    state.value.categoryList = categories.data;
    state.value.postList = posts.data.data;
    state.value.pagination = posts.data.pagination;
  });
</script>

<template>
  <div class="board-list-container">
    <div class="search-section">
      <PostSearch
        :category-list="state.categoryList"
        :search-dto="searchDto"
        @emit-sort="emitSort"
        @search-post="searchPost"
      />
    </div>

    <v-row v-if="boardType !== 'notice'" class="write-button-section pr-3">
      <v-spacer />
      <v-btn class="mr-4" color="primary" size="large" @click="writeBtn">
        글 등록
      </v-btn>
    </v-row>

    <div class="content-section">
      <PostList
        :pagination="state.pagination"
        :post-list="state.postList"
        :search-dto="searchDto"
        @go-detail="goDetail"
      />
    </div>

    <div class="paging-section">
      <PostPaging
        :pagination="state.pagination"
        :search-dto="searchDto"
        @move-page="movePage"
      />
    </div>
  </div>
</template>

<style scoped>
  .board-list-container {
    width: 100%;
  }

  .search-section,
  .write-button-section,
  .content-section,
  .paging-section {
    margin-bottom: 1rem;
  }
</style>
