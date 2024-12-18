<script setup>
  const { searchDto, pagination } = defineProps({
    searchDto: {
      type: Object,
      default: () => ({}),
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['movePage']);

  const page = ref(searchDto.page);

  watch(
    () => searchDto.page,
    newPage => {
      page.value = newPage;
    }
  );

  const changePage = () => {
    emit('movePage', page.value);
  };
</script>

<template>
  <div class="pagination-container">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-if="pagination?.totalCount > 0"
              v-model="page"
              :aria-label="'페이지 네비게이션'"
              class="my-4"
              :length="pagination.currentPage + (pagination.hasMore ? 1 : 0)"
              :show-first-last-page="true"
              :total-visible="7"
              variant="outlined"
              @update:model-value="changePage"
            ></v-pagination
            ><v-pagination
              v-else
              :aria-label="'데이터가 없습니다'"
              :length="0"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
  .pagination-container {
    text-align: center;
    margin-top: 1rem;
  }
</style>
