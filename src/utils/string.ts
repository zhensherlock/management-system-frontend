export const getSex = (sex: string) => {
  if (sex === '1') {
    return '男';
  } else if (sex === '2') {
    return '女';
  } else {
    return '-';
  }
};
