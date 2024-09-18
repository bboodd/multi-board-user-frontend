<template>
  <v-container class="pa-16" max-width="70%">
    <form @submit.prevent="submit">
      <v-row class="border-b-md mb-0">
        <v-col class="mt-4 text-start" cols="2" md="2">
          <span>분류*</span>
        </v-col>
        <v-col cols="10" md="10">
          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            item-title="categoryName"
            item-value="categoryId"
            :items="props.categoryList"
            label="분류 선택"
            return-object
            variant="outlined"
            width="50%"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="border-b-md mb-0">
        <v-col class="mt-4 text-start" cols="2" md="2">
          <span>제목*</span>
        </v-col>
        <v-col cols="10" md="10">
          <v-text-field
            v-model="title.value.value"
            :counter="100"
            :error-messages="title.errorMessage.value"
            label="제목"
            placeholder="제목을 입력해 주세요."
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="border-b-md mb-0">
        <v-col class="mt-4 text-start" cols="2" md="2">
          <span>내용*</span>
        </v-col>
        <v-col cols="10" md="10">
          <v-textarea
            v-model="content.value.value"
            :error-messages="content.errorMessage.value"
            label="내용"
            :no-resize="true"
            placeholder="내용을 입력해 주세요."
            rows="12"
            variant="outlined"
          ></v-textarea>
        </v-col>
      </v-row>
      <PostFileInput
        :files="files"
        :response-file-list="responseFileList"
        @add-file="addFile"
        @remove-file="removeFile"
        @select-file="selectFile"
      />

      <v-btn color="indigo" size="large" type="submit">등록</v-btn>
      <v-btn class="ml-5" color="red" size="large">취소</v-btn>
    </form>
  </v-container>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import _ from 'lodash';
import { savePost, updatePost } from '@/apis/free/freePostService';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  categoryList: {
    type: Array,
    default: () => {
      return [];
    },
  },
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
  postId: {
    type: Number,
    default: 0,
  },
});

const { handleSubmit } = useForm({
  validationSchema: {
    category(value) {
      if (value) return true;
      return '카테고리를 선택해 주세요.';
    },
    title(value) {
      if (value) {
        if (value?.length < 100) return true;
        return '제목은 100자 이하여야 합니다.';
      }
      return '제목을 입력해 주세요.';
    },
    content(value) {
      if (value) {
        if (value?.length < 4000) return true;
        return '내용은 4000자 이내여야 합니다.';
      }

      return '내용을 입력해 주세요.';
    },
  },
  initialValues: {},
});

const category = useField('category');
const title = useField('title');
const content = useField('content');

const files = ref([{}]);
const removeFileIds = ref([]);
const responseFileList = ref(props.fileList);

watchEffect(() => {
  if (!_.isEmpty(props.post)) {
    category.value.value = _.find(props.categoryList, object => {
      return object.categoryId === props.post.categoryId;
    });
    title.value.value = props.post.title;
    content.value.value = props.post.content;
  }
});

const submit = handleSubmit(values => {
  const formData = new FormData();
  formData.append('categoryId', values.category.categoryId);
  formData.append('title', values.title);
  formData.append('content', values.content);
  files.value.forEach(file => formData.append('files', file));
  removeFileIds.value.forEach(id => formData.append('removeFileIds', id));
  //   const requestPost = ref({
  //     categoryId: values.category.categoryId,
  //     title: values.title,
  //     content: values.content,
  //     files: toRaw(files.value),
  //     removeFileIds: toRaw(removeFileIds.value),
  //   });
  if (props.postId) {
    updatePost(props.postId, formData).then(() => {
      router.push({
        path: `/free/${props.postId}`,
        query: route.query,
      });
    });
  } else {
    savePost(formData).then(() => {
      router.push({ path: `/free`, query: route.query });
    });
  }
});

const selectFile = (file, idx) => {
  if (!file) {
    return false;
  }

  const fileSize = Math.floor(file.size / 1024 / 1024);
  if (fileSize > 2) {
    alert('2MB 이하의 파일을 업로드 해 주세요.');
    e.target.value = '';
    return false;
  }

  files.value[idx] = file;
};

const addFile = () => {
  files.value.push({});
};

const addRemoveFileId = fileId => {
  if (removeFileIds.value.includes(fileId)) {
    return false;
  }
  removeFileIds.value.push(fileId);
};

const removeFile = (idx, fileId) => {
  console.log(idx);
  if (fileId) {
    addRemoveFileId(fileId);
    responseFileList.value.splice(idx, 1);
    return false;
  }

  if (idx === 0 && files.value.length === 1) {
    files.value = [{}];
    return false;
  }

  files.value.splice(idx, 1);
};
</script>

<style scoped></style>
