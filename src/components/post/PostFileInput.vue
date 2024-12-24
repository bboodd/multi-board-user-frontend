<script setup>
  import { useRoute } from 'vue-router';
  import { getImage } from '@/apis/fileService';

  const route = useRoute();
  const boardType = route.path.split('/')[1];
  const postId = route.params.id;

  const { files, responseFileList } = defineProps({
    files: {
      type: Array,
      default: () => [{}],
    },
    responseFileList: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits([
    'selectFile',
    'addFile',
    'removeFile',
    'downloadEmit',
  ]);

  const FILE_LIMITS = {
    free: { maxSize: 2, maxCount: 5 },
    gallery: { maxSize: 1, maxCount: 10 },
  };

  const defaultImg = ref(
    new URL(`@/assets/defaultImg.png`, import.meta.url).href
  );

  const filesImgUrl = ref(new Array(10).fill(defaultImg.value));

  const thumbnailUrls = ref({});

  // 썸네일 이미지 로드 함수
  const loadThumbnail = async fileId => {
    try {
      const response = await getImage(postId, fileId);
      thumbnailUrls.value[fileId] = response.data;
    } catch (error) {
      console.error('Failed to load thumbnail:', error);
      thumbnailUrls.value[fileId] = defaultImg.value;
    }
  };

  // responseFileList 변경 감지
  watch(
    () => responseFileList,
    async newFiles => {
      if (boardType === 'gallery' && newFiles?.length) {
        for (const file of newFiles) {
          await loadThumbnail(file.id);
        }
      }
    },
    { immediate: true }
  );

  // 파일 검증 함수
  const validateFile = (file, type) => {
    const fileSize = Math.floor(file.size / 1024 / 1024);
    const limit = FILE_LIMITS[type].maxSize;

    if (fileSize > limit) {
      alert(`${limit}MB 이하의 파일을 업로드 해 주세요.`);
      return false;
    }
    return true;
  };

  onBeforeUnmount(() => {
    filesImgUrl.value.forEach(url => {
      if (url !== defaultImg.value) {
        URL.revokeObjectURL(url);
      }
    });
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
    if (!file) return false;

    if (!validateFile(file, boardType)) {
      e.target.value = '';
      return false;
    }

    if (boardType === 'gallery') {
      const url = window.URL.createObjectURL(file);
      filesImgUrl.value[idx] = url;
    }

    emit('selectFile', file, idx);
  };

  /**
   * 파일 추가 버튼 함수
   */
  const addFileBtn = () => {
    const fileLength = files.length + responseFileList.length;
    const limit = FILE_LIMITS[boardType]?.maxCount;

    if (fileLength < limit) {
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
    } else {
      delete thumbnailUrls.value[fileId];
    }
    emit('removeFile', idx, fileId);
  };

  const downloadBtn = (fileId, originalName) => {
    emit('downloadEmit', postId, fileId, originalName);
  };
</script>

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

      <div v-if="responseFileList?.length">
        <div
          v-for="(file, idx) in responseFileList"
          :key="`response-${file.id}-${idx}`"
          class="file-item"
        >
          <div v-if="boardType === 'gallery'" class="image-container">
            <img
              alt="gallery image"
              class="gallery-image"
              :src="thumbnailUrls[file.id] || defaultImg"
            />
          </div>
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
            @click="downloadBtn(file.id, file.originalName)"
            >다운로드</v-btn
          >
          <v-btn
            append-icon="mdi-close"
            class="mb-6 ml-5 pl-1"
            color="red"
            @click="removeFileBtn(idx, file.id)"
          ></v-btn>
        </div>
      </div>

      <div v-for="(file, idx) in files" :key="`file-${idx}`" class="file-item">
        <div v-if="boardType === 'gallery'" class="image-container">
          <img
            alt="gallery image"
            class="gallery-image"
            :src="filesImgUrl[idx]"
          />
        </div>
        <v-text-field
          class="upload-name"
          density="compact"
          :model-value="file.name"
          placeholder="파일을 선택해 주세요."
          readonly
          variant="outlined"
          width="50%"
        ></v-text-field>
        <button class="file-select" @click="selectFileBtn">파일선택</button>
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

<style scoped>
  .upload-name {
    display: inline-block;
    vertical-align: middle;
    width: 50%; /* inline style을 scoped style로 이동 */
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

  .file-info {
    margin-bottom: 20px;
  }

  .gallery-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  .file-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .image-container {
    width: 120px;
    height: 120px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
  }

  .gallery-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    width: auto;
    height: auto;
  }
</style>
