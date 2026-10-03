import { getShikiCode } from "#lib/utils/getShikiCode.js";

export const useShiki = (node: HTMLElement, { code, language }: { code: string; language: string }) => {
  const html = getShikiCode(code, language);
  if (html) {
    node.innerHTML = html;
  }
};
