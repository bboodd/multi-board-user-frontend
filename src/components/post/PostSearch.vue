<script setup>
  import _ from 'lodash';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth.store';
  import { storeToRefs } from 'pinia';

  // 상수 분리
  const RECORD_SIZE_OPTIONS = [10, 20, 30, 40, 50];
  const ORDER_BY_OPTIONS = [
    { orderByName: '등록일시', orderBy: 'createdAt' },
    { orderByName: '분류', orderBy: 'categoryId' },
    { orderByName: '제목', orderBy: 'title' },
    { orderByName: '조회수', orderBy: 'viewCount' },
  ];
  const SORT_OPTIONS = [
    { sortName: '내림차순', sortBy: 'desc' },
    { sortName: '오름차순', sortBy: 'asc' },
  ];

  const route = useRoute();
  const boardType = route.path.split('/')[1];

  const authStore = useAuthStore();
  const { nickname } = storeToRefs(authStore);

  const { categoryList, searchDto } = defineProps({
    categoryList: {
      type: Array,
      default: () => [],
    },
    searchDto: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['searchPost', 'emitSort']);

  // 날짜 관련 상태
  const startDateMenu = ref(false);
  const endDateMenu = ref(false);
  const selectDate = ref({
    startDate: searchDto.startDate ? new Date(searchDto.startDate) : null,
    endDate: searchDto.endDate ? new Date(searchDto.endDate) : null,
  });

  // 검색 관련 상태
  const loading = ref(false);
  const inputKeyword = ref(searchDto.keyword);
  const selectRecordSize = ref(searchDto.size || 10);
  const selectCategory = ref();
  const selectOrderBy = ref(ORDER_BY_OPTIONS[0]);
  const selectSort = ref(SORT_OPTIONS[0]);
  const selectMyAsk = ref();

  // computed 속성들
  const computedCategoryList = computed(() => {
    const list = [...categoryList];
    list.unshift({ id: 0, name: '전체 분류' });
    return list;
  });

  const maxDate = computed(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const aYearAgo = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  });

  // 날짜 포맷 함수
  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .slice(0, -1);
  };

  const formattedStartDate = computed(() =>
    formatDate(selectDate.value.startDate)
  );
  const formattedEndDate = computed(() => formatDate(selectDate.value.endDate));

  /**
   * 검색 함수
   */
  const searchBtn = async () => {
    loading.value = true;

    try {
      const searchParams = {
        startDate: selectDate.value.startDate,
        endDate: selectDate.value.endDate,
        categoryId: selectCategory.value?.id,
        keyword: inputKeyword.value,
        page: searchDto.page,
        size: selectRecordSize.value,
        orderBy: selectOrderBy.value.orderBy,
        sortBy: selectSort.value.sortBy,
        nickname: selectMyAsk.value,
      };

      emit('searchPost', searchParams);
    } finally {
      setTimeout(() => (loading.value = false), 1000);
    }
  };

  // 정렬 변경 함수
  const changeSort = () => {
    if (!selectOrderBy.value || !selectSort.value) {
      console.warn('정렬 조건이 선택되지 않았습니다.');
      return;
    }

    emit('emitSort', {
      size: selectRecordSize.value || 10,
      orderBy: selectOrderBy.value.orderBy,
      sortBy: selectSort.value.sortBy,
    });
  };

  // props 변경 감시
  watchEffect(() => {
    selectCategory.value = _.find(
      computedCategoryList.value,
      obj => obj.id === (searchDto.categoryId || 0)
    );

    selectOrderBy.value =
      _.find(ORDER_BY_OPTIONS, obj => obj.orderBy === searchDto.orderBy) ||
      ORDER_BY_OPTIONS[0];

    selectSort.value =
      _.find(SORT_OPTIONS, obj => obj.sortBy === searchDto.sortBy) ||
      SORT_OPTIONS[0];
  });
</script>

<template>
  <v-sheet class="search-container">
    <v-row class="search-row border-b-md" dense>
      <span class="date-label">등록일시</span>

      <!-- 시작일 Date Picker -->
      <v-col cols="2" md="2">
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          min-width="auto"
          transition="scale-transition"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedStartDate"
              :label="'시작일'"
              readonly
              v-bind="props"
              variant="outlined"
            />
          </template>
          <v-date-picker
            v-model="selectDate.startDate"
            :max="selectDate.endDate"
            :min="aYearAgo"
            @update:model-value="startDateMenu = false"
          />
        </v-menu>
      </v-col>

      <span class="date-separator">~</span>

      <!-- 종료일 Date Picker -->
      <v-col cols="2" md="2">
        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          min-width="auto"
          transition="scale-transition"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedEndDate"
              :label="'종료일'"
              readonly
              v-bind="props"
              variant="outlined"
            />
          </template>
          <v-date-picker
            v-model="selectDate.endDate"
            :max="maxDate"
            :min="selectDate.startDate"
            @update:model-value="endDateMenu = false"
          />
        </v-menu>
      </v-col>

      <!-- Category Select -->
      <v-col v-if="boardType !== 'qna'" cols="2" md="2">
        <v-select
          v-model="selectCategory"
          class="category-select"
          item-title="name"
          item-value="id"
          :items="computedCategoryList"
          label="분류"
          return-object
          variant="outlined"
        />
      </v-col>

      <!-- Search Input -->
      <v-col
        :cols="boardType !== 'qna' ? 4 : 6"
        :md="boardType !== 'qna' ? 4 : 6"
      >
        <v-text-field
          v-model="inputKeyword"
          class="search-input"
          density="default"
          label="제목 or 내용"
          variant="outlined"
        />
      </v-col>

      <!-- Search Button -->
      <v-col>
        <v-btn
          block
          color="primary"
          :loading="loading"
          size="x-large"
          @click="searchBtn"
        >
          검색
        </v-btn>
      </v-col>

      <!-- My Inquiries Checkbox -->
      <v-col
        v-if="boardType === 'qna' && nickname"
        class="my-inquiries pt-0 pb-0"
        cols="12"
        md="12"
      >
        <span>나의 문의 내역만 보기</span>
        <v-checkbox
          v-model="selectMyAsk"
          density="compact"
          false-value=""
          :value="nickname"
        />
      </v-col>
    </v-row>

    <!-- Sort Options -->
    <v-row class="sort-row">
      <v-col cols="1" md="1">
        <v-select
          v-model="selectRecordSize"
          :items="RECORD_SIZE_OPTIONS"
          label="페이지 당"
          variant="outlined"
          width="85"
          @update:model-value="changeSort"
        />
      </v-col>
      <span class="ml-3 records-label">개씩 보기</span>

      <v-spacer />

      <span class="sort-label">정렬</span>
      <v-col class="mr-10" cols="1" md="1">
        <v-select
          v-model="selectOrderBy"
          item-title="orderByName"
          item-value="orderBy"
          :items="ORDER_BY_OPTIONS"
          label="기준"
          return-object
          variant="outlined"
          width="120"
          @update:model-value="changeSort"
        />
      </v-col>
      <v-col class="mr-10" cols="1" md="1">
        <v-select
          v-model="selectSort"
          item-title="sortName"
          item-value="sortBy"
          :items="SORT_OPTIONS"
          label="방법"
          return-object
          variant="outlined"
          width="120"
          @update:model-value="changeSort"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
  .search-container {
    padding: 16px;
    padding-bottom: 0;
  }

  .search-row {
    border: 1px solid var(--v-border-color);
    padding: 6px 2px 0;
  }

  .date-label,
  .date-separator {
    float: left;
    margin-top: 18px;
  }

  .date-label {
    padding-left: 10px;
  }

  .category-select,
  .search-input {
    padding: 0 5px;
  }

  .my-inquiries {
    margin-left: 0px;
    padding-left: 0px;
  }

  .my-inquiries span {
    float: left;
    margin-top: 8px;
    margin-left: 15px;
  }

  .sort-row {
    margin-top: 16px;
  }

  .records-label,
  .sort-label {
    margin-top: 30px;
  }
</style>
