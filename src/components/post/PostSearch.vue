<template>
  <v-sheet class="pa-16 pb-0">
    <v-row class="border-md pb-0 pt-6 pl-2 pr-2" dense>
      <span style="float: left; margin-top: 18px; padding-left: 10px"
        >등록일시</span
      >
      <v-col cols="2" md="2">
        <v-date-input
          v-model="selectDate.startDate"
          class="pl-5 pr-5"
          label="시작일"
          :max="selectDate.endDate"
          :min="aYearAgo"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
        ></v-date-input>
      </v-col>

      <span style="float: left; margin-top: 18px">~</span>
      <v-col cols="2" md="2">
        <v-date-input
          v-model="selectDate.endDate"
          class="pl-5 pr-5"
          label="종료일"
          :max="maxDate"
          :min="selectDate.startDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
        >
        </v-date-input>
      </v-col>

      <v-col v-if="boardType !== 'ask'" cols="2" md="2">
        <v-select
          v-model="selectCategory"
          class="pl-5 pr-5"
          item-title="categoryName"
          item-value="categotyId"
          :items="computedCategoryList"
          label="분류"
          return-object
          variant="outlined"
        >
        </v-select>
      </v-col>

      <v-col
        :cols="boardType !== 'ask' ? 4 : 6"
        :md="boardType !== 'ask' ? 4 : 6"
      >
        <v-text-field
          v-model="inputKeyword"
          class="pl-5 pr-5"
          label="제목 or 내용"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="1" md="1">
        <v-btn
          block
          class="pl-5"
          color="primary"
          :loading="loading"
          size="x-large"
          @click="searchBtn"
          >검색</v-btn
        >
      </v-col>

      <v-col
        v-if="boardType === 'ask' && nickname"
        class="mb-0 pb-0"
        cols="12"
        md="12"
      >
        <span class="float-left mt-2 ml-5">나의 문의 내역만 보기</span>
        <v-checkbox
          v-model="selectMyAsk"
          density="compact"
          false-value=""
          :value="nickname"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row class="">
      <v-col cols="1" md="1">
        <v-select
          v-model="selectRecordSize"
          item-value="recordSize"
          :items="recordSizeList"
          label="페이지 당"
          variant="outlined"
          @update:model-value="changeSort"
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
          return-object
          variant="outlined"
          @update:model-value="changeSort"
        ></v-select>
      </v-col>
      <v-col cols="2" md="2">
        <v-select
          v-model="selectSort"
          item-title="sortName"
          item-value="sort"
          :items="sortList"
          label="방법"
          return-object
          variant="outlined"
          @update:model-value="changeSort"
        ></v-select>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import _ from 'lodash';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const route = useRoute();
const boardType = route.path.split('/')[1];

const authStore = useAuthStore();
const { nickname } = storeToRefs(authStore);

const props = defineProps({
  categoryList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  searchDto: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emit = defineEmits(['searchPost', 'emitSort']);

const loading = ref(false);

const computedCategoryList = computed(() => {
  const list = props.categoryList;
  const allCategory = { categoryId: 0, categoryName: '전체 분류' };
  list.unshift(allCategory);
  return list;
});
const recordSizeList = ref([10, 20, 30, 40, 50]);
const orderByList = ref([
  { orderByName: '등록일시', orderBy: 'createdDate' },
  { orderByName: '분류', orderBy: 'categoryId' },
  { orderByName: '제목', orderBy: 'title' },
  { orderByName: '조회수', orderBy: 'viewCnt' },
]);
const sortList = ref([
  { sortName: '내림차순', sortBy: 'desc' },
  { sortName: '오름차순', sortBy: 'asc' },
]);

const aYearAgo = computed(() => {
  const date = new Date();
  return new Date(date.setFullYear(date.getFullYear() - 1));
});

/**
 * 화면에서 선택시 변경되는 값들 + 기본값 세팅
 */
const selectDate = ref({
  startDate: props.searchDto.startDate,
  endDate: props.searchDto.endDate || new Date(),
});
const maxDate = ref(new Date().toDateString());
const inputKeyword = ref(props.searchDto.keyword);
const selectRecordSize = ref(props.searchDto.recordSize);
// 아래의 빈 값은 props변경시 자동으로 기본값 세팅이 안되기 때문에 watchEffect로 감시
const selectCategory = ref();
const selectOrderBy = ref();
const selectSort = ref();
const selectMyAsk = ref();

/**
 * 검색 함수
 */
const searchBtn = () => {
  loading.value = true;

  setTimeout(() => (loading.value = false), 1000);

  const changeSearch = ref({
    startDate: selectDate.value.startDate,
    endDate: selectDate.value.endDate,
    categoryId: selectCategory.value.categoryId,
    keyword: inputKeyword.value,
    page: props.searchDto.page,
    pageSize: props.searchDto.pageSize,
    recordSize: selectRecordSize.value,
    orderBy: selectOrderBy.value.orderBy,
    sortBy: selectSort.value.sortBy,
    nickname: selectMyAsk.value,
  });

  console.log(changeSearch.value);

  emit('searchPost', changeSearch.value);
};

/**
 * 검색조건 변경 함수
 */
const changeSort = () => {
  const sortCondition = ref({
    recordSize: selectRecordSize.value,
    orderBy: selectOrderBy.value.orderBy,
    sortBy: selectSort.value.sortBy,
  });

  emit('emitSort', sortCondition.value);
};

/**
 * props값 변경 감시
 */
watchEffect(() => {
  selectCategory.value = _.find(computedCategoryList.value, obj => {
    return obj.categoryId === props.searchDto.categoryId;
  });
  selectOrderBy.value = _.find(orderByList.value, obj => {
    return obj.orderBy === props.searchDto.orderBy;
  });
  selectSort.value = _.find(sortList.value, obj => {
    return obj.sortBy === props.searchDto.sortBy;
  });
});

onMounted(() => {});
</script>

<style scoped></style>
