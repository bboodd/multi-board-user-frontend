<script setup>
import { formatDate } from '@/utils/formater';
import { useRoute } from 'vue-router';
import { getImage } from '@/apis/fileService';

const route = useRoute();
const boardType = route.path.split('/')[1];

const { post, fileList } = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
  fileList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['download']);

const imgUrlList = ref([]);

const loadImages = async () => {
  // post.id와 fileList 모두 확인
  if (boardType === 'gallery' && post?.id && fileList.length > 0) {
    try {
      for (const file of fileList) {
        const response = await getImage(boardType, post.id, file.id);
        imgUrlList.value.push({
          src: response.data,
          originalName: file.originalName,
        });
        // 서버 부하 방지를 위한 지연
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  }
};

// fileList가 변경될 때마다 이미지 로드
watch(
  [() => post, () => fileList],
  async ([newPost, newFileList]) => {
    if (newPost?.id && newFileList?.length) {
      imgUrlList.value = [];
      await loadImages();
    }
  },
  { immediate: true }
);

const contentRowsByType = {
  free: 13,
  gallery: 6,
  default: 6,
};

const selectContentRows = board =>
  contentRowsByType[board] || contentRowsByType.default;

const downloadClick = (postId, fileId, originalName) => {
  emit('download', postId, fileId, originalName);
};
</script>

<template>
  <v-container class="pa-16 border-md mt-10" max-width="70%">
    <v-row class="border-b-lg border-surface-variant" rows="1">
      <v-col class="text-center" cols="1" md="1">
        <span
          ><strong>{{ post.categoryName }}</strong></span
        >
      </v-col>
      <v-col class="text-left" cols="6" md="6">
        <div>
          {{ post.title
          }}<span v-if="boardType === 'qna'" class="ml-5">{{
            post.commentCount ? '(답변완료)' : '(미답변)'
          }}</span>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="3" md="3">
        <span>{{ formatDate(post.createdAt) }}</span>
        &nbsp;
        <span>{{ post.nickname }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="2" md="2">
        <span>조회수</span>
        &nbsp;:&nbsp;
        <span>{{ post.viewCount }}</span>
      </v-col>
    </v-row>

    <v-row v-if="boardType === 'gallery' && imgUrlList.length > 0">
      <v-carousel class="gallery-carousel" height="600" :show-arrows="true">
        <v-carousel-item
          v-for="(item, idx) in imgUrlList"
          :key="idx"
          :aria-label="`이미지 ${idx + 1}: ${item.originalName}`"
          class="carousel-item"
        >
          <div class="image-container">
            <img
              :alt="item.originalName"
              class="gallery-image"
              :src="item.src"
            />
          </div>
          <div class="text-overlay">
            {{ item.originalName }}
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-row>

    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
          :model-value="post.content"
          :no-resize="true"
          :readonly="true"
          :rows="selectContentRows(boardType)"
          variant="outlined"
          >{{ post.content }}</v-textarea
        >
      </v-col>
    </v-row>

    <div v-if="boardType === 'free'">
      <v-row v-for="file in fileList" :key="file.id" class="text-start" dense>
        <v-col cols="12" md="12">
          <v-icon class="pr-5" icon="mdi-download" />
          <span
            :aria-label="`${file.originalName} 파일 다운로드`"
            class="clickable-download"
            role="button"
            tabindex="0"
            @click="downloadClick(post.id, file.id, file.originalName)"
            >{{ file.originalName }}</span
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.clickable-download {
  cursor: pointer;
  color: black;
  text-decoration: underline;
}

.clickable-download:hover {
  color: cornflowerblue;
}

.text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  text-align: center;
}

.gallery-carousel {
  width: 100%;
  margin: 20px 0;
}

.carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: auto;
  height: auto;
}

.text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 12px;
  text-align: center;
  font-size: 1rem;
}

:deep(.v-carousel .v-btn) {
  background-color: rgba(0, 0, 0, 0.3);
}

:deep(.v-carousel .v-btn:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
