import axiosInstance from '.';

// 파일 리스트 정보 조회
const getFileList = async postId => {
  const res = await axiosInstance.get(`/posts/${postId}/files`);
  return res;
};

// 다운로드 파일
const downloadFile = async (postId, fileId, fileOriginalName) => {
  try {
    const response = await axiosInstance.get(
      `/posts/${postId}/files/${fileId}/download`,
      { responseType: 'blob' }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileOriginalName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const getThumbnail = async postId => {
  const res = await axiosInstance.get(`/posts/${postId}/thumbnail`);
  return res;
};

const getImage = async (postId, fileId) => {
  const res = await axiosInstance.get(`/posts/${postId}/files/${fileId}/image`);
  return res;
};

export { getFileList, downloadFile, getThumbnail, getImage };
