<script setup>
  import { getTimegap } from '@/utils/formater';
  import { useAuthStore } from '@/stores/auth.store';
  import { storeToRefs } from 'pinia';
  import { useField, useForm } from 'vee-validate';
  import { useRoute } from 'vue-router';

  const MAX_COMMENT_LENGTH = 1000;

  const route = useRoute();
  const boardType = route.path.split('/')[1];

  const authStore = useAuthStore();
  const { nickname } = storeToRefs(authStore);

  const { commentList } = defineProps({
    commentList: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['saveComment', 'deleteComment']);

  // 댓글 입력 가능 여부
  const canAddComment = computed(() => nickname.value && boardType !== 'qna');

  const { handleSubmit } = useForm({
    validationSchema: {
      inputComment(value) {
        if (!value?.trim()) return '댓글을 입력해 주세요.';
        if (value.length > MAX_COMMENT_LENGTH)
          return `댓글은 ${MAX_COMMENT_LENGTH}자 이하여야 합니다.`;
        return true;
      },
    },
  });

  const inputComment = useField('inputComment');

  const submit = handleSubmit(values => {
    emit('saveComment', { content: values.inputComment });
    resetField(); // 초기화
  });

  const deleteClick = commentId => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      emit('deleteComment', commentId);
    }
  };

  // 댓글 작성자 여부 확인
  const isCommentAuthor = commentNickname => nickname.value === commentNickname;
</script>

<template>
  <v-container class="pa-8" max-width="auto">
    <h2 class="text-start">댓글</h2>
    <v-row
      v-for="comment in commentList"
      :key="comment.id"
      class="comment-border pb-3 pt-3"
      dense
    >
      <v-col class="text-start" cols="6" md="6">
        <span
          ><strong>{{ comment.nickname }}</strong></span
        >
        &nbsp;
        <span>{{ getTimegap(comment.createdAt) }}</span>
      </v-col>
      <v-spacer />
      <v-col v-if="isCommentAuthor(comment.nickname)" cols="1" md="1">
        <span class="clickable-delete" @click="deleteClick(comment.id)"
          >삭제</span
        >
      </v-col>
      <v-col class="text-start" cols="12" md="12">
        <span class="ml-1">{{ comment.content }}</span>
      </v-col>
    </v-row>
    <form
      v-if="canAddComment"
      class="mt-5 bg-grey-lighten-3"
      @submit.prevent="submit"
    >
      <v-row>
        <v-col class="mt-3 pb-0" cols="12" md="12">
          <v-textarea
            v-model="inputComment.value.value"
            bg-color="white"
            class="comment-textarea pl-3 pr-3"
            :counter="MAX_COMMENT_LENGTH"
            :error-messages="inputComment.errorMessage.value"
            no-resize
            placeholder="댓글을 작성해 주세요."
            rows="4"
            variant="outlined"
          ></v-textarea>
        </v-col>
      </v-row>
      <div class="text-end">
        <v-btn
          class="mr-4 mb-4"
          color="primary"
          height="50"
          large
          type="submit"
          width="85"
        >
          <v-icon class="mr-2 pr-0 pl-3" icon="mdi-wechat" size="30"></v-icon>
          <span class="pl-0 pr-2 text-subtitle-1">등록</span>
        </v-btn>
      </div>
    </form>
  </v-container>
</template>

<style scoped>
  .clickable-delete {
    cursor: pointer;
    color: black;
    transition: color 0.3s ease;
  }

  .clickable-delete:hover {
    color: cornflowerblue;
  }

  .comment-border {
    border-bottom: 0.1px solid;
  }

  .relative-container {
    position: relative;
  }

  .comment-textarea {
    width: 100%;
  }
</style>
