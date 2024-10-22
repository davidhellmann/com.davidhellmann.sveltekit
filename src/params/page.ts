export const match = (param): boolean => {
  const num = parseInt(param, 10);
  return Number.isInteger(num) && String(num) === param;
};
