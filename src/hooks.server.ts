import { sequence } from "@sveltejs/kit/hooks";
import { type Handle } from "@sveltejs/kit";

const preloadFonts: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    preload: ({ type }) => type === "font"
  });
};

export const handle = sequence(preloadFonts);
