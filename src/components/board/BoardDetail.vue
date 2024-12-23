<script setup>
  import { downloadFile } from '@/apis/fileService';
  import { deletePost, getPost } from '@/apis/postService';
  import {
    deleteComment,
    getCommentList,
    saveComment,
  } from '@/apis/commentService';
  import { useAuthStore } from '@/stores/auth.store';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const { nickname } = storeToRefs(authStore);
  const route = useRoute();
  const router = useRouter();

  // URL 관련 상수
  const postId = route.params.id;
  const boardType = route.path.split('/')[1];

  // 상태 관리
  const state = ref({
    post: {},
    fileList: [],
    commentList: [],
  });

  // 게시글 데이터 로드
  const fetchPostData = async () => {
    const response = await getPost(boardType, postId);
    state.value = {
      post: response.data,
      fileList: response.data.files,
      commentList: response.data.comments,
    };
  };

  // 댓글 데이터만 새로 로드
  const fetchComments = async () => {
    const res = await getCommentList(postId);
    state.value.commentList = res.data;
  };

  // 댓글 저장
  const onSaveComment = async commentRequest => {
    await saveComment(postId, commentRequest);
    await fetchComments();
  };

  // 댓글 삭제
  const onDeleteComment = async commentId => {
    await deleteComment(postId, commentId);
    await fetchComments();
  };

  // 라우팅 핸들러
  const listBtn = () =>
    router.push({
      path: `/${boardType}`,
      query: route.query,
    });

  const updateBtn = () =>
    router.push({
      path: `/${boardType}/write/${postId}`,
      query: route.query,
    });

  const deleteBtn = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    await deletePost(boardType, postId);
    alert('삭제되었습니다.');
    router.push(`/${boardType}`);
  };

  // 파일 다운로드
  const download = (postId, fileId, originalName) => {
    downloadFile(postId, fileId, originalName);
  };

  // 수정/삭제 버튼 표시 여부
  const updateAndDeleteBtnFlag = computed(() => {
    if (boardType === 'notice') return false;
    return nickname.value === state.value.post?.nickname;
  });

  onMounted(fetchPostData);
</script>

<template>
  <div class="post-detail-container">
    <!-- 단일 루트 엘리먼트로 감싸기 -->
    <div class="content-section">
      <PostContent
        :file-list="state.fileList"
        :post="state.post"
        @download="download"
      />
    </div>

    <div v-if="boardType !== 'gallery'" class="comment-section">
      <PostComment
        :comment-list="state.commentList"
        @delete-comment="onDeleteComment"
        @save-comment="onSaveComment"
      />
    </div>

    <v-row class="button-section pa-6">
      <v-col>
        <v-btn
          class="mr-6"
          color="indigo"
          size="large"
          width="100"
          @click="listBtn"
        >
          목록
        </v-btn>
        <template v-if="updateAndDeleteBtnFlag">
          <v-btn
            class="mr-6"
            color="red"
            size="large"
            width="100"
            @click="deleteBtn"
          >
            삭제
          </v-btn>
          <v-btn
            class="mr-6"
            color="blue-grey"
            size="large"
            width="100"
            @click="updateBtn"
          >
            수정
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
  .post-detail-container {
    width: 100%;
  }

  .content-section,
  .comment-section {
    margin-bottom: 1rem;
  }

  .button-section {
    margin-top: 1rem;
  }
</style>
