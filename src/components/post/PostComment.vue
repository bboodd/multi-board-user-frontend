<template>
  <v-container class="pa-8 bg-grey-lighten-3" max-width="70%">
    <form @submit.prevent="submit">
      <v-row v-if="nickname && boardType !== 'ask'" class="">
        <v-col cols="12" md="12">
          <v-textarea
            v-model="inputComment.value.value"
            bg-color="white"
            class="float-left"
            counter="1000"
            :error-messages="inputComment.errorMessage.value"
            no-resize
            placeholder="댓글을 입력해 주세요."
            rows="3"
            variant="outlined"
            width="85%"
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
      v-for="(comment, idx) in props.commentList"
      :key="idx"
      class="comment-border pb-3 pt-3"
      dense
    >
      <v-col class="text-start" cols="4" md="4">
        <span
          ><strong>{{ comment.nickname }}</strong></span
        >
        &nbsp;
        <span>{{ formatDate(comment.createdDate) }}</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1" md="1">
        <span
          v-if="nickname === comment.nickname"
          class="clickable-delete"
          @click="deleteClick(comment.commentId)"
          >삭제</span
        >
      </v-col>
      <v-col class="text-start" cols="12" md="12"
        ><span class="ml-1">{{ comment.content }}</span></v-col
      >
    </v-row>
  </v-container>
</template>

<script setup>
import { formatDate } from '@/utils/formater';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { useField, useForm } from 'vee-validate';
import { useRoute } from 'vue-router';

const route = useRoute();
const boardType = route.path.split('/')[1];

const authStore = useAuthStore();
const { nickname } = storeToRefs(authStore);

const props = defineProps({
  commentList: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits(['saveComment']);

const { handleSubmit } = useForm({
  validationSchema: {
    inputComment(value) {
      if (value) {
        if (value?.length < 100) return true;
        return '댓글은 1000자 이하여야 합니다.';
      }
      return '댓글을 입력해 주세요.';
    },
  },
});

const inputComment = useField('inputComment');

const submit = handleSubmit(values => {
  const commentRequest = ref({
    content: values.inputComment,
  });
  emit('saveComment', commentRequest.value);
});

const deleteClick = commentId => {
  alert(commentId);
};
</script>

<style scoped>
.clickable-delete {
  cursor: pointer;
  color: black;
}
.clickable-delete:hover {
  color: cornflowerblue;
}
.comment-border {
  border-bottom: dotted 1.5px;
}
</style>
