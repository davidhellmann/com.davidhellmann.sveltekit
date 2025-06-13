import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token');
  const targetUri = url.searchParams.get('uri');
  const xCraftPreview = url.searchParams.get('x-craft-preview');
  const xCraftLivePreview = url.searchParams.get('x-craft-live-preview');

  if (!token) {
    throw error(400, 'Missing preview token');
  }

  if (!targetUri) {
    throw error(400, 'Missing target URI');
  }

  const previewParams = new URLSearchParams();
  previewParams.set('token', token);
  
  if (xCraftPreview) {
    previewParams.set('x-craft-preview', xCraftPreview);
  }
  
  if (xCraftLivePreview) {
    previewParams.set('x-craft-live-preview', xCraftLivePreview);
  }

  const redirectUrl = `${targetUri}?${previewParams.toString()}`;
  
  throw redirect(302, redirectUrl);
};