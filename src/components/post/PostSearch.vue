<template>
  <v-sheet class="pa-16 pb-0">
    <v-row class="border-md pb-0 pt-6 pl-2 pr-2" dense>
      <span style="float: left; margin-top: 18px; padding-left: 10px"
        >등록일시</span
      >
      <v-col cols="2" md="2">
        <!-- 시작일 선택 -->
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
        >
          <template #activator="{ props: menuProps }">
            <v-text-field
              v-bind="menuProps"
              label="시작일"
              :model-value="formattedStartDate"
              readonly
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="selectDate.startDate"
            class="pl-5 pr-5"
            elevation="0"
            :max="selectDate.endDate"
            :min="aYearAgo"
            @update:model-value="startDateMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <span style="float: left; margin-top: 18px">~</span>
      <v-col cols="2" md="2">
        <!-- 종료일 선택 -->
        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
        >
          <template #activator="{ props: menuProps }">
            <v-text-field
              v-bind="menuProps"
              label="종료일"
              :model-value="formattedEndDate"
              readonly
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="selectDate.endDate"
            class="pl-5 pr-5"
            elevation="0"
            :max="maxDate"
            :min="selectDate.startDate"
            @update:model-value="endDateMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col v-if="boardType !== 'qna'" cols="2" md="2">
        <v-select
          v-model="selectCategory"
          class="pl-5 pr-5"
          item-title="name"
          item-value="id"
          :items="computedCategoryList"
          label="분류"
          return-object
          variant="outlined"
        >
        </v-select>
      </v-col>

      <v-col
        :cols="boardType !== 'qna' ? 4 : 6"
        :md="boardType !== 'qna' ? 4 : 6"
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
        v-if="boardType === 'qna' && nickname"
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
          item-value="size"
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

const startDateMenu = ref(false);
const endDateMenu = ref(false);

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
  const list = [...props.categoryList];
  const allCategory = { id: 0, name: '전체 분류' };
  list.unshift(allCategory);
  return list;
});

const recordSizeList = ref([10, 20, 30, 40, 50]);
const orderByList = ref([
  { orderByName: '등록일시', orderBy: 'createdAt' },
  { orderByName: '분류', orderBy: 'categoryId' },
  { orderByName: '제목', orderBy: 'title' },
  { orderByName: '조회수', orderBy: 'viewCount' },
]);
const sortList = ref([
  { sortName: '내림차순', sortBy: 'desc' },
  { sortName: '오름차순', sortBy: 'asc' },
]);

const aYearAgo = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().substr(0, 10);
});

// 날짜 포맷 함수
const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 포맷된 날짜를 반환하는 computed 속성
const formattedStartDate = computed(() => {
  return formatDate(selectDate.value.startDate);
});

const formattedEndDate = computed(() => {
  return formatDate(selectDate.value.endDate);
});

/**
 * 화면에서 선택시 변경되는 값들 + 기본값 세팅
 */
const selectDate = ref({
  startDate: props.searchDto.startDate
    ? new Date(props.searchDto.startDate)
    : null,
  endDate: props.searchDto.endDate ? new Date(props.searchDto.endDate) : null,
});
const maxDate = ref(new Date().toISOString().substr(0, 10));
const inputKeyword = ref(props.searchDto.keyword);
const selectRecordSize = ref(props.searchDto.size || 10);
// 아래의 빈 값은 props변경시 자동으로 기본값 세팅이 안되기 때문에 watchEffect로 감시
const selectCategory = ref();
const selectOrderBy = ref(orderByList.value[0]);
const selectSort = ref(sortList.value[0]);
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
    categoryId: selectCategory.value.id,
    keyword: inputKeyword.value,
    page: props.searchDto.page,
    size: selectRecordSize.value,
    orderBy: selectOrderBy.value.orderBy,
    sortBy: selectSort.value.sortBy,
    nickname: selectMyAsk.value,
  });

  emit('searchPost', changeSearch.value);
};

/**
 * 검색조건 변경 함수
 */
const changeSort = () => {
  // null check 추가
  if (!selectOrderBy.value || !selectSort.value) {
    console.warn('정렬 조건이 선택되지 않았습니다.');
    return;
  }

  const sortCondition = {
    size: selectRecordSize.value || 10,
    orderBy: selectOrderBy.value.orderBy,
    sortBy: selectSort.value.sortBy,
  };

  emit('emitSort', sortCondition);
};

/** 
/**
 * props값 변경 감시
 */
watchEffect(() => {
  // 카테고리 설정
  selectCategory.value = _.find(computedCategoryList.value, obj => {
    return obj.id === (props.searchDto.categoryId || 0);
  });

  // orderBy 설정
  const foundOrderBy = _.find(orderByList.value, obj => {
    return obj.orderBy === props.searchDto.orderBy;
  });
  selectOrderBy.value = foundOrderBy || orderByList.value[0];

  // sort 설정
  const foundSort = _.find(sortList.value, obj => {
    return obj.sortBy === props.searchDto.sortBy;
  });
  selectSort.value = foundSort || sortList.value[0];
});

onMounted(() => {});
</script>

<style scoped></style>
