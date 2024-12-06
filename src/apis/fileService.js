import axiosInstance from '.';

// 파일 리스트 정보 조회
const getFileList = async (boardType, postId) => {
  const res = await axiosInstance.get(`/${boardType}/posts/${postId}/files`);
  return res.data;
};

// 다운로드 파일
const downloadFile = async (boardType, postId, fileId, fileOriginalName) => {
  try {
    const response = await axiosInstance.get(
      `/${boardType}/posts/${postId}/files/${fileId}/download`,
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

const getThumbnail = async (boardType, postId) => {
  const res = await axiosInstance.get(
    `/${boardType}/posts/${postId}/thumbnail`
  );
  return res;
};

const getImage = async (boardType, postId, fileId) => {
  const res = await axiosInstance.get(
    `/${boardType}/posts/${postId}/files/${fileId}/image`
  );
  return res;
};

export { getFileList, downloadFile, getThumbnail, getImage };
