<script setup>
import { formatDate } from '@/utils/formater';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { getThumbnail } from '@/apis/fileService';
// import * as lodash from 'lodash';

const route = useRoute();
const boardType = route.path.split('/')[1];

const HEADERS_CONFIG = {
  free: [
    { title: '번호', align: 'start', width: '5%', key: 'index' },
    { title: '분류', align: 'center', width: '7.5%', key: 'categoryName' },
    { title: '제목', align: 'start', width: '57.5%', key: 'title' },
    { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
    { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
    { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
  ],
  gallery: [
    { title: '번호', align: 'start', width: '5%', key: 'index' },
    { title: '분류', align: 'center', width: '5%', key: 'categoryName' },
    { title: '', align: 'start', width: '60%', key: 'title' },
    { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
    { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
    { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
  ],
  qna: [
    { title: '번호', align: 'start', width: '5%', key: 'index' },
    { title: '제목', align: 'start', width: '65%', key: 'title' },
    { title: '조회', align: 'center', width: '10%', key: 'viewCount' },
    { title: '등록일시', align: 'center', width: '10%', key: 'createdAt' },
    { title: '등록자', align: 'center', width: '10%', key: 'nickname' },
  ],
  notice: null, // free와 동일
};

const { searchDto, postList, pagination } = defineProps({
  searchDto: {
    type: Object,
    default: () => ({}),
  },
  postList: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['goDetail']);

const selectHeaders = board => {
  return HEADERS_CONFIG[board] || HEADERS_CONFIG.free;
};

const calculateIndex = (totalCount, page, size, index) => {
  return totalCount - (page - 1) * size - index;
};

const weekAgo = computed(() => {
  const date = new Date();
  return new Date(date.setDate(date.getDate() - 7));
});

const postListWithIndex = computed(() => {
  if (!postList.length) return [];

  return postList.map((post, index) => ({
    ...post,
    index: calculateIndex(
      pagination.totalCount,
      searchDto.page,
      searchDto.size,
      index
    ),
  }));
});

const newFlag = createdAt => {
  return new Date(createdAt) > weekAgo.value;
};

const postListWithIndexAndFinPosts = computed(() => {
  if (!postList.length) return [];

  const postAndIndex = postListWithIndex.value;
  const finPostList = postList.filter(post => post.fixed === true);
  return finPostList.concat(postAndIndex);
});

const titleClick = (postId, locked, nickname) => {
  const authStore = useAuthStore();
  if (locked && nickname !== authStore.nickname) {
    return alert('비밀 글 입니다.');
  }
  emit('goDetail', postId);
};

const thumbnailUrls = ref({});

const loadThumbnail = async postId => {
  if (thumbnailUrls.value[postId]) return;

  try {
    const response = await getThumbnail(boardType, postId);
    thumbnailUrls.value[postId] = response.data;
  } catch (error) {
    console.error('Failed to load thumbnail:', error);
    thumbnailUrls.value[postId] =
      'https://cdn.vuetifyjs.com/images/parallax/material.jpg';
  }
};

// postList가 변경될 때 썸네일 로드
watch(
  () => postList,
  async newVal => {
    if (!newVal?.length) return;

    const loadPromises = newVal.map(
      post => !thumbnailUrls.value[post.id] && loadThumbnail(post.id)
    );

    await Promise.all(loadPromises);
  },
  { immediate: true }
);
</script>

<template>
  <v-sheet class="post-list-container">
    <v-data-table
      :headers="selectHeaders(boardType)"
      hide-default-footer
      item-key="index"
      :items="
        boardType !== 'notice'
          ? postListWithIndex
          : postListWithIndexAndFinPosts
      "
      :items-per-page="searchDto.size"
      :no-data-text="'검색된 결과가 없습니다.'"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="text-left"
            >총 {{ pagination?.totalCount ?? 0 }}건</v-toolbar-title
          >
        </v-toolbar>
      </template>

      <template v-if="boardType === 'free'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td class="table-cell-padding">{{ item.categoryName }}</td>
          <td class="text-start text-body-1">
            <span class="clickable-title" @click="titleClick(item.id)">
              {{ item.title }}
              {{ item.commentCount ? `(${item.commentCount})` : '' }}
            </span>
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.fileCount"
              class="ml-1"
              icon="mdi-paperclip"
              size="small"
            />
          </td>
          <td class="table-cell-padding">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="table-cell-padding">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'gallery'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td class="table-cell-padding">{{ item.categoryName }}</td>
          <td>
            <div class="gallery-item-container">
              <!-- 썸네일 이미지 부분 -->
              <div class="thumbnail-wrapper">
                <v-img
                  v-if="thumbnailUrls[item.id]"
                  class="thumbnail-image"
                  contain
                  height="158"
                  :src="thumbnailUrls[item.id]"
                  @click="titleClick(item.id)"
                >
                  <template #placeholder>
                    <v-row
                      align="center"
                      class="fill-height ma-0"
                      justify="center"
                    >
                      <v-progress-circular
                        color="grey-lighten-3"
                        indeterminate
                      />
                    </v-row>
                  </template>

                  <div v-if="item.fileCount > 1" class="file-count-badge">
                    +{{ item.fileCount - 1 }}
                  </div>
                </v-img>
                <v-skeleton-loader
                  v-else
                  class="thumbnail-image"
                  type="image"
                />
              </div>

              <!-- 콘텐츠 부분 -->
              <div class="content-container" @click="titleClick(item.id)">
                <div class="title-wrapper">
                  <h3 class="title-text">
                    {{ item.title }}
                  </h3>
                  <div class="badges">
                    <v-chip
                      v-if="newFlag(item.createdAt)"
                      class="mr-2"
                      color="red"
                      size="x-small"
                    >
                      NEW
                    </v-chip>
                  </div>
                </div>
                <p class="content-preview">{{ item.content }}</p>
              </div>
            </div>
          </td>
          <td class="table-cell-padding">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="table-cell-padding">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'qna'" #item="{ item }">
        <tr>
          <td class="text-start">{{ item.index }}</td>
          <td class="text-start text-body-1">
            <span
              class="clickable-title"
              @click="titleClick(item.id, item.locked, item.nickname)"
            >
              {{ item.title }} ({{ item.commentCount ? '답변완료' : '미답변' }})
            </span>
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
            <v-icon
              v-if="item.locked"
              class="ml-1"
              icon="mdi-lock"
              size="small"
            />
          </td>
          <td class="table-cell-padding">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="table-cell-padding">{{ item.nickname }}</td>
        </tr>
      </template>

      <template v-else-if="boardType === 'notice'" #item="{ item }">
        <tr :class="{ 'bg-pink-lighten-5': !item.index }">
          <td class="text-start">{{ item.index }}</td>
          <td class="table-cell-padding">{{ item.categoryName }}</td>
          <td class="text-start text-body-1">
            <span class="clickable-title" @click="titleClick(item.id)">
              {{ item.title }}
            </span>
            <span v-if="newFlag(item.createdAt)" class="ml-2 text-red"
              >new</span
            >
          </td>
          <td class="table-cell-padding">{{ item.viewCount }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="table-cell-padding">{{ item.nickname }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<style scoped>
.post-list-container {
  padding: 16px;
  padding-top: 8px;
}

.table-cell-padding {
  padding-right: 35px;
}

.clickable-title {
  cursor: pointer;
  color: black;
  transition: color 0.3s ease;
}

.clickable-title:hover {
  color: cornflowerblue;
}

.gallery-item-container {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  align-items: flex-start;
}

.gallery-item-container:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-container {
  width: 250px;
  height: 150px;
  flex-shrink: 0;
}

.thumbnail-wrapper {
  position: relative;
  width: 280px;
  height: 158px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.v-img__img) {
  object-fit: contain !important;
}

:deep(.v-img__img--contain) {
  object-fit: contain !important;
}

/* hover 효과 수정 */
.thumbnail-image:hover :deep(.v-img__img) {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.file-count-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  cursor: pointer;
  padding-left: 0;
}

.title-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.title-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #333;
  text-align: left;
}

.badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.text-red {
  color: red;
}

.content-preview {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  text-align: left;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
