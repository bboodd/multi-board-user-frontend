<script setup>
  import { getTimegap } from '@/utils/formater';
  import { useRoute } from 'vue-router';
  import { getImage } from '@/apis/fileService';
  import DOMpurify from 'dompurify';

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
          const response = await getImage(post.id, file.id);
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

  const downloadClick = (postId, fileId, originalName) => {
    emit('download', postId, fileId, originalName);
  };

  const sanitizedContent = computed(() => {
    return DOMpurify.sanitize(post.content || '');
  });
</script>

<template>
  <v-container class="pa-10 mt-10" max-width="auto">
    <v-row class="border-b-md border-surface-variant mb-5" rows="3">
      <v-col class="text-start pb-0" cols="12" md="12">
        <div>
          <h2 class="strong-text">{{ post.title }}</h2>
          <span v-if="boardType === 'qna'" class="ml-5">{{
            post.commentCount ? '(답변완료)' : '(미답변)'
          }}</span>
        </div>
      </v-col>
      <v-col
        v-if="boardType !== 'qna'"
        class="text-start pb-0"
        cols="12"
        md="12"
      >
        <v-chip color="blue" small text-color="white">{{
          post.categoryName
        }}</v-chip>
      </v-col>
      <v-col class="text-start mb-5" cols="12" md="12">
        <v-chip class="text-subtitle-1" color="gray" small text-color="white">{{
          post.nickname
        }}</v-chip>
        &nbsp;
        <span class="text-subtitle-2">{{ getTimegap(post.createdAt) }}</span>
        &nbsp;
        <span class="text-subtitle-2">조회</span>
        &nbsp;
        <span class="text-subtitle-2">{{ post.viewCount }}</span>
      </v-col>
    </v-row>

    <v-row v-if="boardType === 'gallery' && imgUrlList.length > 0">
      <v-carousel class="gallery-carousel" height="600" :show-arrows="true">
        <v-carousel-item
          v-for="(item, idx) in imgUrlList"
          :key="idx"
          class="carousel-item"
        >
          <div class="image-container">
            <img
              :alt="item.originalName"
              class="gallery-image"
              :src="item.src"
            />
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-row>

    <v-row class="mb-5">
      <v-col cols="12" md="12">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="text-start text-h6" v-html="sanitizedContent"></div>
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
