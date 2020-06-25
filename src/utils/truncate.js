const truncate = (num, limit) => {
  const factor = 10 ** limit;
  const wholeNumber = Math.floor(num * factor);
  return wholeNumber / factor;
};
export default truncate;
