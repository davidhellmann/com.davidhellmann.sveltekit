export const getRandomNumberFromRange = (from: number = -5, to: number = 5): number => {
  return Math.floor(Math.random() * (to - from + 1) + from);
};
