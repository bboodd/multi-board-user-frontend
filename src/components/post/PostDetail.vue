<template>
  <v-container class="pa-16 border-xl" max-width="70%">
    <v-row class="border-b-lg border-surface-variant" rows="1">
      <v-col class="text-right" cols="1" md="1">
        <span
          ><strong>{{ props.post.categoryName }}</strong></span
        >
      </v-col>
      <v-col class="text-left" cols="7" md="7">
        <div>{{ props.post.title }}</div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="2" md="2">
        <span>{{ formatDate(props.post.createdDate) }}</span>
        &nbsp;
        <span>{{ props.post.nickname }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="2" md="2">
        <span>조회수</span>
        &nbsp;:&nbsp;
        <span>{{ props.post.viewCnt }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
          :model-value="props.post.content"
          :readonly="true"
          rows="13"
          variant="outlined"
          >{{ props.post.content }}</v-textarea
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { nickname } = storeToRefs(authStore);

const updateAndDeleteBtnFlag = computed(() => {
  if (nickname === post.nickname) {
    return true;
  } else {
    return false;
  }
});

const props = defineProps({
  post: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const listBtn = () => {};

const deleteBtn = () => {};

const updateBtn = () => {};

onMounted(() => {});
</script>

<style scoped>
/* Add any additional styles here */
</style>
