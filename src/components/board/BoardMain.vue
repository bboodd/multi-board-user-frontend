<script setup>
import { useRouter } from 'vue-router';
import { getDashboardPosts } from '@/apis/postService';
import { getThumbnail } from '@/apis/fileService';
import { formatDate } from '@/utils/formater';

const router = useRouter();

const boardPreviews = ref({
  freePosts: [],
  galleryPosts: [],
  qnaPosts: [],
  noticePosts: [],
});

const loading = ref(true);

const BOARD_CONFIG = {
  notice: {
    title: '공지사항',
    icon: 'mdi-bullhorn',
    color: 'blue-lighten-1',
    dataKey: 'noticePosts',
    path: 'notice',
  },
  free: {
    title: '자유게시판',
    icon: 'mdi-forum',
    color: 'green-lighten-1',
    dataKey: 'freePosts',
    path: 'free',
  },
  gallery: {
    title: '갤러리',
    icon: 'mdi-image',
    color: 'purple-lighten-1',
    dataKey: 'galleryPosts',
    path: 'gallery',
  },
  qna: {
    title: 'Q&A',
    icon: 'mdi-help-circle',
    color: 'orange-lighten-1',
    dataKey: 'qnaPosts',
    path: 'qna',
  },
};

const fetchDashboardPosts = async () => {
  try {
    loading.value = true;
    const res = await getDashboardPosts();

    // 응답 데이터가 있는 경우에만 할당
    if (res) {
      boardPreviews.value = {
        noticePosts: res.data.noticePosts || [],
        freePosts: res.data.freePosts || [],
        galleryPosts: res.data.galleryPosts || [],
        qnaPosts: res.data.qnaPosts || [],
      };
    }
  } catch (error) {
    console.error('대시보드 데이터 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
};

const goToBoard = boardType => {
  router.push(`/${BOARD_CONFIG[boardType].path}`);
};

const goToPost = (boardType, postId) => {
  router.push(`/${BOARD_CONFIG[boardType].path}/${postId}`);
};

const isNew = createdAt => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return new Date(createdAt) > oneWeekAgo;
};

const thumbnailUrls = ref({});

const loadThumbnail = async postId => {
  try {
    const response = await getThumbnail(postId);
    thumbnailUrls.value[postId] =
      response.data || 'https://cdn.vuetifyjs.com/images/parallax/material.jpg';
  } catch (error) {
    console.error('썸네일 로딩 실패:', error);
    thumbnailUrls.value[postId] =
      'https://cdn.vuetifyjs.com/images/parallax/material.jpg';
  }
};

// 갤러리 게시글의 썸네일 로드
watch(
  () => boardPreviews.value.galleryPosts,
  async newPosts => {
    if (newPosts?.length) {
      for (const post of newPosts) {
        await loadThumbnail(post.id);
      }
    }
  },
  { immediate: true }
);

onMounted(fetchDashboardPosts);
</script>

<template>
  <v-container class="board-main">
    <v-row>
      <v-col v-for="(board, type) in BOARD_CONFIG" :key="type" cols="12" md="6">
        <v-card class="board-preview" :color="board.color">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" :icon="board.icon" />
            {{ board.title }}
            <v-spacer />
            <v-btn variant="text" @click="goToBoard(type)">
              더보기
              <v-icon icon="mdi-chevron-right" />
            </v-btn>
          </v-card-title>

          <v-card-text class="bg-white">
            <v-list v-if="!loading" lines="two">
              <template v-if="boardPreviews[board.dataKey]?.length">
                <v-list-item
                  v-for="post in boardPreviews[board.dataKey]"
                  :key="post.id"
                  class="preview-item"
                  @click="goToPost(type, post.id)"
                >
                  <!-- 공지사항 -->
                  <template v-if="type === 'notice'">
                    <v-list-item-title class="d-flex align-center">
                      <v-chip class="mr-2" size="x-small">{{
                        post.categoryName
                      }}</v-chip>
                      <span class="text-truncate">{{ post.title }}</span>
                      <v-chip
                        v-if="isNew(post.createdAt)"
                        class="ml-2"
                        color="red"
                        size="x-small"
                        >NEW</v-chip
                      >
                    </v-list-item-title>
                  </template>

                  <!-- 자유게시판 -->
                  <template v-if="type === 'free'">
                    <v-list-item-title class="d-flex align-center">
                      <v-chip class="mr-2" size="x-small">{{
                        post.categoryName
                      }}</v-chip>
                      <span class="text-truncate">{{ post.title }}</span>
                      <v-chip
                        v-if="post.commentCount"
                        class="ml-2"
                        color="primary"
                        size="x-small"
                        >{{ post.commentCount }}</v-chip
                      >
                      <v-chip
                        v-if="isNew(post.createdAt)"
                        class="ml-2"
                        color="red"
                        size="x-small"
                        >NEW</v-chip
                      >
                      <v-icon
                        v-if="post.fileCount > 0"
                        class="ml-2"
                        color="grey"
                        size="small"
                        >mdi-paperclip</v-icon
                      >
                    </v-list-item-title>
                  </template>

                  <!-- 갤러리 -->
                  <template v-if="type === 'gallery'">
                    <v-list-item-title class="d-flex align-center">
                      <v-chip class="mr-2" size="x-small">{{
                        post.categoryName
                      }}</v-chip>
                      <div class="gallery-container">
                        <v-avatar size="40">
                          <v-img
                            cover
                            :loading="!thumbnailUrls[post.id]"
                            :src="
                              thumbnailUrls[post.id] ||
                              'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
                            "
                          >
                            <template #placeholder>
                              <v-progress-circular indeterminate />
                            </template>
                          </v-img>
                        </v-avatar>
                        <span v-if="post.fileCount > 1" class="file-count">
                          +{{ post.fileCount - 1 }}
                        </span>
                      </div>
                      <span class="text-truncate">{{ post.title }}</span>
                      <v-chip
                        v-if="isNew(post.createdAt)"
                        class="ml-2"
                        color="red"
                        size="x-small"
                        >NEW</v-chip
                      >
                    </v-list-item-title>
                  </template>

                  <!-- 문의게시판 -->
                  <template v-if="type === 'qna'">
                    <v-list-item-title class="d-flex align-center">
                      <span class="text-truncate">{{ post.title }}</span>
                      <v-chip
                        class="ml-2"
                        :color="post.commentCount ? 'success' : 'warning'"
                        size="x-small"
                      >
                        {{ post.commentCount ? '답변완료' : '미답변' }}
                      </v-chip>
                      <v-chip
                        v-if="isNew(post.createdAt)"
                        class="ml-2"
                        color="red"
                        size="x-small"
                        >NEW</v-chip
                      >
                      <v-icon
                        v-if="post.locked"
                        class="ml-2"
                        color="grey"
                        size="small"
                        >mdi-lock</v-icon
                      >
                    </v-list-item-title>
                  </template>

                  <v-list-item-subtitle
                    class="d-flex align-center text-caption"
                  >
                    <span>{{ post.nickname }}</span>
                    <v-divider class="mx-2" vertical />
                    <span>{{ formatDate(post.createdAt) }}</span>
                    <v-divider class="mx-2" vertical />
                    <span>조회 {{ post.viewCount }}</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
              <v-list-item v-else>
                <div class="text-center pa-4">게시글이 없습니다.</div>
              </v-list-item>
            </v-list>
            <div
              v-else
              class="d-flex justify-center align-center"
              style="height: 200px"
            >
              <v-progress-circular indeterminate />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.board-main {
  padding: 24px;
}

.board-preview {
  height: 100%;
  min-height: 400px;
}

.preview-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.preview-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}

.v-list {
  background: transparent;
}

.text-truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.position-relative {
  position: relative;
}

.file-count-chip {
  position: absolute;
  right: -12px;
  bottom: -8px;
  padding: 0 8px;
  font-weight: bold;
  border: 2px solid white;
  min-width: 28px;
  justify-content: center;
}

.text-truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery-thumbnail {
  position: relative;
  overflow: visible;
}
.gallery-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.file-count {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
