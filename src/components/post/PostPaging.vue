<template>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-if="props.pagination"
              v-model="page"
              class="my-4"
              :length="props.pagination.totalPageCount"
              :show-first-last-page="true"
              variant="outlined"
              @update:model-value="changePage"
            ></v-pagination>
            <v-pagination v-else :length="0"></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const props = defineProps({
  searchDto: {
    type: Object,
    default: () => {
      return {};
    },
  },
  pagination: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emit = defineEmits(['movePage']);

const page = ref(props.searchDto.page);

const changePage = () => {
  emit('movePage', page.value);
};
</script>
