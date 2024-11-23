export const match = (param) => {
  const extensions = [".txt", ".xsl", ".xml"];
  return extensions.some((ext) => param.includes(ext));
};
