<template>
  <v-row class="mb-10 border-b-md">
    <v-col class="text-start mt-4" cols="2" md="2">
      <span>첨부</span>
    </v-col>
    <v-col class="text-start" cols="10" md="10">
      <div style="margin-bottom: 20px">
        jpg, gif, png, zip파일만 파일사이즈 2MB까지 업로드 가능합니다. (최대
        5개)
      </div>

      <div v-if="props.responseFileList?.length">
        <div v-for="(file, idx) in props.responseFileList" :key="idx">
          <v-text-field
            v-model="file.originalName"
            class="upload-name"
            readonly
          ></v-text-field>
          <v-btn
            @click="downloadFile(file.postId, file.fileId, file.originalName)"
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

      <div v-for="(file, idx) in props.files" :key="idx">
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
import { downloadFile } from '@/apis/free/freeFileService';

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

const emit = defineEmits(['selectFile', 'addFile', 'removeFile']);

const selectFileBtn = e => {
  e.preventDefault();
  e.target.nextElementSibling.click();
};

const changeFile = (e, idx) => {
  const file = e.target.files[0];
  emit('selectFile', file, idx);
};

const addFileBtn = () => {
  const fileLength = props.files.length + props.responseFileList.length;
  if (fileLength < 5) {
    emit('addFile');
  }
};

const removeFileBtn = (idx, fileId) => {
  emit('removeFile', idx, fileId);
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
