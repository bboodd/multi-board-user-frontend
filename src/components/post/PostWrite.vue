<script setup>
  import { useField, useForm } from 'vee-validate';
  import _ from 'lodash';
  import { useRoute } from 'vue-router';

  // 상수 정의
  const VALIDATION_RULES = {
    TITLE_MAX_LENGTH: 100,
    CONTENT_MAX_LENGTH: 4000,
  };

  const VALIDATION_MESSAGES = {
    CATEGORY_REQUIRED: '카테고리를 선택해 주세요.',
    TITLE_REQUIRED: '제목을 입력해 주세요.',
    TITLE_MAX_LENGTH: '제목은 100자 이하여야 합니다.',
    CONTENT_REQUIRED: '내용을 입력해 주세요.',
    CONTENT_MAX_LENGTH: '내용은 4000자 이내여야 합니다.',
  };

  const route = useRoute();
  const postId = route.params.id;
  const boardType = route.path.split('/')[1];

  const { categoryList, post, fileList } = defineProps({
    categoryList: {
      type: Array,
      default: () => [],
    },
    post: {
      type: Object,
      default: () => ({}),
    },
    fileList: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['savePost', 'updatePost', 'download']);

  // 폼 유효성 검사 설정
  const { handleSubmit, reset } = useForm({
    validationSchema: {
      category(value) {
        if (value || boardType === 'qna') return true;
        return VALIDATION_MESSAGES.CATEGORY_REQUIRED;
      },
      title(value) {
        if (!value) return VALIDATION_MESSAGES.TITLE_REQUIRED;
        if (value.length >= VALIDATION_RULES.TITLE_MAX_LENGTH) {
          return VALIDATION_MESSAGES.TITLE_MAX_LENGTH;
        }
        return true;
      },
      content(value) {
        if (!value) return VALIDATION_MESSAGES.CONTENT_REQUIRED;
        if (value.length >= VALIDATION_RULES.CONTENT_MAX_LENGTH) {
          return VALIDATION_MESSAGES.CONTENT_MAX_LENGTH;
        }
        return true;
      },
    },
    initialValues: {},
  });

  // 폼 필드 설정
  const { value: categoryField, errorMessage: categoryError } =
    useField('category');
  const { value: titleField, errorMessage: titleError } = useField('title');
  const { value: contentField, errorMessage: contentError } =
    useField('content');
  const locked = ref(false);

  // 파일 관련 상태
  const files = ref([{}]);
  const removeFileIds = ref([]);
  const responseFileList = ref([]);

  // 폼 데이터 초기화
  const initializeFormData = () => {
    if (_.isEmpty(post)) return;

    categoryField.value = _.find(categoryList, { id: post.categoryId });
    titleField.value = post.title;
    contentField.value = post.content;
    responseFileList.value = fileList;
    locked.value = post.locked;
  };

  watchEffect(initializeFormData);

  // 폼 제출 처리
  const submit = handleSubmit(values => {
    const formData = new FormData();

    if (postId) {
      formData.append('postId', postId);
    }

    if (boardType !== 'qna' && values.category) {
      formData.append('categoryId', values.category.id);
    }

    formData.append('title', values.title);
    formData.append('content', values.content);

    if (boardType === 'qna') {
      formData.append('locked', locked.value);
    }

    files.value
      .filter(file => file && file.size > 0)
      .forEach(file => formData.append('files', file));

    removeFileIds.value.forEach(id => formData.append('removeFileIds', id));

    emit(postId ? 'updatePost' : 'savePost', formData);
    reset();
  });

  // 파일 관련 함수들
  const fileHandlers = {
    selectFile: (file, idx) => {
      files.value[idx] = file;
    },

    addFile: () => {
      files.value.push({});
    },

    removeFile: (idx, fileId) => {
      if (fileId) {
        if (!removeFileIds.value.includes(fileId)) {
          removeFileIds.value.push(fileId);
        }
        responseFileList.value.splice(idx, 1);
        return;
      }

      if (idx === 0 && files.value.length === 1) {
        files.value = [{}];
        return;
      }

      files.value.splice(idx, 1);
    },

    downloadEmit: (postId, fileId, originalName) => {
      emit('download', postId, fileId, originalName);
    },
  };
</script>

<template>
  <v-container class="post-write-container">
    <form @submit.prevent="submit">
      <v-row v-if="boardType !== 'qna'" class="form-row">
        <v-col class="label-col">
          <span class="required-field">분류</span>
        </v-col>
        <v-col cols="10">
          <v-select
            v-model="categoryField"
            class="category-select"
            :error-messages="categoryError"
            item-title="name"
            item-value="id"
            :items="categoryList"
            label="분류 선택"
            return-object
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row class="form-row">
        <v-col class="label-col">
          <span class="required-field">제목</span>
        </v-col>
        <v-col cols="10">
          <v-text-field
            v-model="titleField"
            :counter="VALIDATION_RULES.TITLE_MAX_LENGTH"
            :error-messages="titleError"
            label="제목"
            placeholder="제목을 입력해 주세요."
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row class="form-row">
        <v-col class="label-col">
          <span class="required-field">내용</span>
        </v-col>
        <v-col cols="10">
          <v-textarea
            v-model="contentField"
            :error-messages="contentError"
            label="내용"
            :no-resize="true"
            placeholder="내용을 입력해 주세요."
            rows="12"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row v-if="boardType === 'qna'" class="form-row">
        <v-col class="label-col">
          <span>비밀글</span>
        </v-col>
        <v-col cols="10">
          <v-checkbox v-model="locked" />
        </v-col>
      </v-row>

      <PostFileInput
        v-if="boardType === 'free' || boardType === 'gallery'"
        :files="files"
        :response-file-list="responseFileList"
        @add-file="fileHandlers.addFile"
        @download-emit="fileHandlers.downloadEmit"
        @remove-file="fileHandlers.removeFile"
        @select-file="fileHandlers.selectFile"
      />

      <div class="button-group">
        <v-btn color="indigo" size="large" type="submit">등록</v-btn>
        <v-btn class="ml-5" color="red" size="large">취소</v-btn>
      </div>
    </form>
  </v-container>
</template>

<style scoped>
  .post-write-container {
    padding: 16px;
    max-width: 70%;
  }

  .form-row {
    border-bottom: 1px solid var(--v-border-color);
    margin-bottom: 0;
  }

  .label-col {
    margin-top: 16px;
    text-align: start;
    width: 16.666%;
  }

  .required-field {
    position: relative;
  }

  .required-field::after {
    content: '*';
    color: red;
    margin-left: 2px;
  }

  .category-select {
    width: 50%;
  }

  .button-group {
    margin-top: 16px;
  }
</style>
