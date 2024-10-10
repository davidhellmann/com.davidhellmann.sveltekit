export const getFirstEntry = <T>(entries?: T[]): T | undefined => {
  if (!entries || entries.length === 0) {
    return undefined;
  }
  return entries[0];
};
