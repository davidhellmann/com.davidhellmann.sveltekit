import { getShikiCode } from "$utils/getShikiCode";

export const useShiki = (node: HTMLElement, { code, language }: { code: string; language: string }) => {
  const html = getShikiCode(code, language);
  if (html) {
    node.innerHTML = html;
  }
};
