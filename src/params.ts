import { defineParams } from "@sveltejs/kit/params";

const matchFiles = (param: string) => {
  const extensions = [".txt", ".xsl", ".xml"];

  return extensions.some((ext) => param.includes(ext));
};

const matchPage = (param: string): boolean => {
  const num = parseInt(param, 10);

  return Number.isInteger(num) && String(num) === param;
};

const matchSlug = (param: string) => {
  return isNaN(Number(param)) && !param.includes(".");
};

const matchUri = (param: string) => {
  return isNaN(Number(param)) && !param.includes(".");
};

export const params = defineParams({
  files: (param) => (matchFiles(param) ? param : undefined),
  page: (param) => (matchPage(param) ? param : undefined),
  slug: (param) => (matchSlug(param) ? param : undefined),
  uri: (param) => (matchUri(param) ? param : undefined)
});
