<script setup>
  import { formatDate } from '@/utils/formater';
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
  <v-container class="pa-8 bg-grey-lighten-3" max-width="70%">
    <form v-if="canAddComment" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="12">
          <v-textarea
            v-model="inputComment.value.value"
            bg-color="white"
            class="float-left"
            :counter="MAX_COMMENT_LENGTH"
            :error-messages="inputComment.errorMessage.value"
            no-resize
            placeholder="댓글을 입력해 주세요."
            rows="3"
            variant="outlined"
            width="80%"
          ></v-textarea>
          <v-btn
            class="d-print-inline-block"
            height="100"
            type="submit"
            width="100"
            >등록</v-btn
          >
        </v-col>
      </v-row>
    </form>
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
        <span>{{ formatDate(comment.createdAt) }}</span>
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
    border-bottom: dotted 1.5px;
  }
</style>
