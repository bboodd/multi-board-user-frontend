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
    <v-row v-for="file in props.fileList" :key="file" class="text-start">
      <v-col cols="12" md="12">
        <v-icon class="pr-5" icon="mdi-download" />
        <span
          class="clickable-download"
          @click="
            downloadFile(props.post.postId, file.fileId, file.originalName)
          "
          >{{ file.originalName }}</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { downloadFile } from '@/apis/free/freeFileService';

const props = defineProps({
  post: {
    type: Object,
    default: () => {
      return {};
    },
  },
  fileList: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

onMounted(() => {});
</script>

<style scoped>
.clickable-download {
  cursor: pointer;
  color: black;
  text-decoration: underline;
}
.clickable-download:hover {
  color: cornflowerblue;
}
</style>
