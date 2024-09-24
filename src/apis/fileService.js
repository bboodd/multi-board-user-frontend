import axiosInstance from '.';

// 파일 리스트 정보 조회
const getFileList = async (boardType, postId) => {
  const res = await axiosInstance.get(`/${boardType}/posts/${postId}/files`);
  return res.data;
};

// 다운로드 파일
const downloadFile = async (boardType, postId, fileId, fileOriginalName) => {
  const res = await axiosInstance.get(
    `/${boardType}/posts/${postId}/files/${fileId}/download`,
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileOriginalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export { getFileList, downloadFile };
