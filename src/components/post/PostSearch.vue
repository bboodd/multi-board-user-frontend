<template>
  <v-sheet>
    <v-row dense>
      <v-col cols="2" md="6">
        <span>등록일시</span>
        <v-date-input
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="solo"
        ></v-date-input>
      </v-col>

      <v-col cols="2" md="6">
        <span>~</span>
        <v-date-input
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="solo"
        >
        </v-date-input>
      </v-col>
    </v-row>
  </v-sheet>
  <div class="search">
    <fieldset>
      <div>
        <label
          >등록일 &nbsp;
          <input v-model="searchInfo.startDate" type="date" />&nbsp; ~&nbsp;
          <input v-model="searchInfo.endDate" type="date" />&nbsp; </label
        >&nbsp;
        <select v-model="searchInfo.categoryId">
          &nbsp;
          <option value="0">전체 카테고리</option>
          &nbsp;

          <option
            v-for="category in categoryList"
            :key="category.categoryId"
            :value="category.categoryId"
          >
            {{ category.categoryName }}
          </option></select
        >&nbsp;
        <input
          v-model="searchInfo.keyword"
          placeholder="검색어를 입력해 주세요."
          type="text"
        />&nbsp;
        <button type="button" @click="$emit('searchPost', searchInfo)">
          <i class="fa fa-search">검색</i>
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
const categoryList = ref([]);

const props = defineProps({
  searchInfo: {
    type: Object,
    default: null,
    required: false,
  },
});

const searchInfo = ref({
  startDate: props.searchInfo.startDate,
  endDate: props.searchInfo.endDate,
  categoryId: props.searchInfo.categoryId,
  keyword: props.searchInfo.keyword,
});

onMounted(() => {});
</script>

<style scoped>
.search {
  margin: auto;
  display: flex;
}
</style>
