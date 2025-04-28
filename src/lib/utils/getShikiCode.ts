import { createHighlighterCoreSync } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import js from "shiki/langs/javascript.mjs";
import css from "shiki/langs/css.mjs";
import graphql from "shiki/langs/graphql.mjs";
import html from "shiki/langs/html.mjs";
import json from "shiki/langs/json.mjs";
import markdown from "shiki/langs/markdown.mjs";
import php from "shiki/langs/php.mjs";
import shell from "shiki/langs/shell.mjs";
import twig from "shiki/langs/twig.mjs";
import typescript from "shiki/langs/typescript.mjs";
import yaml from "shiki/langs/yaml.mjs";
import { type LanguageRegistration } from "shiki/core.mjs";

// Themes
import theme from "shiki/themes/synthwave-84.mjs";

type Languages = {
  [key: string]: LanguageRegistration[];
};

const languages: Languages = {
  javascript: js,
  css: css,
  graphql: graphql,
  html: html,
  json: json,
  markdown: markdown,
  php: php,
  shell: shell,
  twig: twig,
  typescript: typescript,
  yaml: yaml
};

const engine = await createOnigurumaEngine(import("shiki/wasm"));

export const getShikiCode = (code: string, language: string): string | undefined => {
  const shiki = createHighlighterCoreSync({
    themes: [theme],
    langs: [languages[language] ?? js],
    engine
  });
  return shiki.codeToHtml(code, { lang: language, theme: theme }) ?? undefined;
};
