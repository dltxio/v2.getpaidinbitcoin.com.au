const prefixID = (_id, prefix) => {
  let id = String(_id);
  while (id.length < 6) id = `0${id}`;
  return `${prefix}${id}`;
};

export default prefixID;
