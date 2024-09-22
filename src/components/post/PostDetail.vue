<template>
  <v-container class="pa-16 border-md mt-10" max-width="70%">
    <v-row class="border-b-lg border-surface-variant" rows="1">
      <v-col class="text-center" cols="1" md="1">
        <span
          ><strong>{{ props.post.categoryName }}</strong></span
        >
      </v-col>
      <v-col class="text-left" cols="6" md="6">
        <div>{{ props.post.title }}</div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="3" md="3">
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

    <v-row v-if="boardType === 'gallery'">
      <v-carousel>
        <v-carousel-item
          v-for="(item, idx) in props.imgUrlList"
          :key="idx"
          cover
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </v-row>

    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
          :model-value="props.post.content"
          :no-resize="true"
          :readonly="true"
          :rows="selectContentRows(boardType)"
          variant="outlined"
          >{{ props.post.content }}</v-textarea
        >
      </v-col>
    </v-row>

    <div v-if="boardType === 'free'">
      <v-row
        v-for="file in props.fileList"
        :key="file"
        class="text-start"
        dense
      >
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
    </div>
  </v-container>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { downloadFile } from '@/apis/free/freeFileService';
import { useRoute } from 'vue-router';

const route = useRoute();

const boardType = route.path.split('/')[1];

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
  imgUrlList: {
    // TODO: 파일 로컬에 저장해서 못불러오는거 해결해야함.(서버에서 resource or firebase or s3)?
    type: Array,
    default: () => {
      return [];
    },
  },
});

const selectContentRows = board => {
  if (board === 'free') return 13;
  if (board === 'gallery') return 6;
};

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
