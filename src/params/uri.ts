export const match = (param) => {
  return isNaN(Number(param)) && !param.includes(".txt");
};
