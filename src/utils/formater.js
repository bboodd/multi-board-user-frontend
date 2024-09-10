import moment from 'moment';

/**
 * date 포맷 함수
 * @param {*} value date 형식 파라미터
 * @returns format된 date
 */
export const formatDate = value => {
  return moment(value).format('YYYY.MM.DD hh:MM');
};
