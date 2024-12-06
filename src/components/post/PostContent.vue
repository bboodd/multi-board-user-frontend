<template>
  <v-container class="pa-16 border-md mt-10" max-width="70%">
    <v-row class="border-b-lg border-surface-variant" rows="1">
      <v-col class="text-center" cols="1" md="1">
        <span
          ><strong>{{ props.post.categoryName }}</strong></span
        >
      </v-col>
      <v-col class="text-left" cols="6" md="6">
        <div>
          {{ props.post.title
          }}<span v-if="boardType === 'qna'" class="ml-5">{{
            props.post.commentCount ? '(답변완료)' : '(미답변)'
          }}</span>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="3" md="3">
        <span>{{ formatDate(props.post.createdAt) }}</span>
        &nbsp;
        <span>{{ props.post.nickname }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="2" md="2">
        <span>조회수</span>
        &nbsp;:&nbsp;
        <span>{{ props.post.viewCount }}</span>
      </v-col>
    </v-row>

    <v-row v-if="boardType === 'gallery' && imgUrlList.length > 0">
      <v-carousel>
        <v-carousel-item
          v-for="(item, idx) in imgUrlList"
          :key="idx"
          cover
          :src="item.src"
        >
          <template #placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
              <v-progress-circular
                color="grey-lighten-5"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </template>
          <div class="text-overlay">
            {{ item.originalName }}
          </div>
        </v-carousel-item>
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
            @click="downloadClick(props.post.id, file.id, file.originalName)"
            >{{ file.originalName }}</span
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { useRoute } from 'vue-router';
import { getImage } from '@/apis/fileService';

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
});

const emit = defineEmits(['download']);

const imgUrlList = ref([]);

const loadImages = async () => {
  // post.id와 fileList 모두 확인
  if (boardType === 'gallery' && props.post?.id && props.fileList.length > 0) {
    try {
      for (const file of props.fileList) {
        const response = await getImage(boardType, props.post.id, file.id);
        imgUrlList.value.push({
          src: response.data,
          originalName: file.originalName,
        });
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  }
};

// fileList가 변경될 때마다 이미지 로드
watch(
  [() => props.post, () => props.fileList],
  async ([newPost, newFileList]) => {
    if (newPost?.id && newFileList?.length) {
      imgUrlList.value = [];
      await loadImages();
    }
  },
  { immediate: true }
);

const selectContentRows = board => {
  if (board === 'free') return 13;
  if (board === 'gallery') return 6;
};

const downloadClick = (postId, fileId, originalName) => {
  emit('download', postId, fileId, originalName);
};
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
