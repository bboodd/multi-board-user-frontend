import moment from 'moment';
/**
 * date 포맷 함수
 * @param {*} value date 형식 파라미터
 * @returns format된 date
 */
export const formatDate = value => {
  return moment(value).format('YYYY.MM.DD HH:MM');
};

export const getTimegap = createdAt => {
  const msgap = Date.now() - new Date(createdAt);
  const minutegap = Math.floor(msgap / 60000);
  const hourgap = Math.floor(msgap / 3600000);
  const daygap = Math.floor(msgap / 86400000);
  const weekgap = Math.floor(msgap / 604800000);
  const monthgap = Math.floor(msgap / 2592000000);
  const yeargap = Math.floor(msgap / 31536000000);

  if (yeargap > 0) {
    return `${yeargap}년 전`;
  }
  if (monthgap > 0) {
    return `${monthgap}월 전`;
  }
  if (weekgap > 0) {
    return `${weekgap}주 전`;
  }
  if (daygap > 0) {
    return `${daygap}일 전`;
  }
  if (hourgap > 0) {
    return `${hourgap}시간 전`;
  }
  if (minutegap > 0) {
    return `${minutegap}분 전`;
  }
  return '방금 전';
};
