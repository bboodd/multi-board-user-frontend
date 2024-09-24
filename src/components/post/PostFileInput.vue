<template>
  <v-row class="mb-10 border-b-md">
    <v-col class="text-start mt-4" cols="2" md="2">
      <span v-if="boardType === 'gallery'">갤러리 이미지</span>
      <span v-else>첨부</span>
    </v-col>
    <v-col class="text-start" cols="10" md="10">
      <div v-if="boardType === 'gallery'" style="margin-bottom: 20px">
        jpg, gif, png, 파일만 파일사이즈 1MB까지 업로드 가능합니다. (최대 10개)
        <br />
        1번째 이미지는 썸네일로 활용 됩니다.
      </div>
      <div v-else style="margin-bottom: 20px">
        jpg, gif, png, zip파일만 파일사이즈 2MB까지 업로드 가능합니다. (최대
        5개)
      </div>

      <div v-if="props?.responseFileList?.length">
        <div v-for="(file, idx) in props.responseFileList" :key="idx">
          <img
            v-if="boardType === 'gallery'"
            height="80"
            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
            width="100"
          />
          <v-text-field
            v-model="file.originalName"
            class="upload-name"
            density="compact"
            readonly
            variant="outlined"
            width="50%"
          ></v-text-field>
          <v-btn
            class="mb-5 ml-5"
            color="indigo"
            size="large"
            @click="downloadBtn(file.postId, file.fileId, file.originalName)"
            >다운로드</v-btn
          >
          <v-btn
            append-icon="mdi-close"
            class="mb-6 ml-5 pl-1"
            color="red"
            @click="removeFileBtn(idx, file.fileId)"
          ></v-btn>
        </div>
      </div>

      <div v-for="(file, idx) in props?.files" :key="idx">
        <img
          v-if="boardType === 'gallery'"
          height="100"
          :src="filesImgUrl[idx]"
          width="100"
        />
        <v-text-field
          v-model="file.name"
          class="upload-name"
          density="compact"
          placeholder="파일을 선택해 주세요."
          readonly
          variant="outlined"
          width="50%"
        ></v-text-field>
        <button class="file-select" @click="selectFileBtn">파일 선택</button>
        <input
          v-if="boardType === 'gallery'"
          accept=".jpg, .gif, .png, .jpeg"
          style="display: none"
          type="file"
          @change="changeFile($event, idx)"
        />
        <input
          v-else
          accept=".jpg, .jpeg, .gif, .png, .zip"
          style="display: none"
          type="file"
          @change="changeFile($event, idx)"
        />
        <v-btn
          append-icon="mdi-close"
          class="mb-6 ml-5 pl-1"
          color="red"
          @click="removeFileBtn(idx)"
        ></v-btn>
      </div>
      <v-btn color="blue-grey" @click="addFileBtn">파일 추가</v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { useRoute } from 'vue-router';
// import _ from 'lodash';

const route = useRoute();
const boardType = route.path.split('/')[1];

const props = defineProps({
  files: {
    type: Array,
    default: () => {
      return [{}];
    },
  },
  responseFileList: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits([
  'selectFile',
  'addFile',
  'removeFile',
  'downloadEmit',
]);

const defaultImg = ref(
  new URL(`@/assets/defaultImg.png`, import.meta.url).href
);

const filesImgUrl = ref(new Array(10).fill(defaultImg.value));

onBeforeUnmount(() => {
  filesImgUrl.value.forEach(url => URL.revokeObjectURL(url));
});

/**
 * 파일 선택 버튼 함수
 * @param e - event
 */
const selectFileBtn = e => {
  e.preventDefault();
  e.target.nextElementSibling.click();
};

/**
 * 파일 change 함수
 * @param e - event
 * @param idx - index
 */
const changeFile = (e, idx) => {
  const file = e.target.files[0];

  if (!file) {
    return false;
  }

  const fileSize = Math.floor(file.size / 1024 / 1024);
  if (boardType === 'free') {
    if (fileSize > 2) {
      alert('2MB 이하의 파일을 업로드 해 주세요.');
      e.target.value = '';
      return false;
    }
  } else {
    if (fileSize > 1) {
      alert('1MB 이하의 파일을 업로드 해 주세요.');
      e.target.value = '';
      return false;
    }

    const url = window.URL.createObjectURL(file);
    filesImgUrl.value[idx] = url;
  }

  emit('selectFile', file, idx);
};

/**
 * 파일 추가 버튼 함수
 */
const addFileBtn = () => {
  const fileLength = props.files.length + props.responseFileList.length;
  if (boardType === 'free' && fileLength < 5) {
    emit('addFile');
  }
  if (boardType === 'gallery' && fileLength < 10) {
    emit('addFile');
  }
};

/**
 * 파일 삭제 버튼 클릭 함수
 * @param idx - index
 * @param fileId - pk
 */
const removeFileBtn = (idx, fileId) => {
  if (!fileId) {
    filesImgUrl.value.splice(idx, 1);
  }
  emit('removeFile', idx, fileId);
};

const downloadBtn = (postId, fileId, originalName) => {
  emit('downloadEmit', postId, fileId, originalName);
};
</script>

<style scoped>
.upload-name {
  display: inline-block;
  vertical-align: middle;
}
input[type='file'] {
  position: absolute;
  overflow: hidden;
}
.file-select {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  vertical-align: middle;
  background-color: #999999;
  cursor: pointer;
  height: 40px;
  margin-left: 20px;
  margin-top: 0px;
  margin-bottom: 25px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px gray;
}
</style>
