import type { IPreviewTokens } from "$graphql/graphql-client";
import type { RequestEvent } from "@sveltejs/kit";

export interface PreviewContext {
  isPreview: boolean;
  tokens?: IPreviewTokens;
}

export function detectPreview(event: RequestEvent): PreviewContext {
  try {
    const { url } = event;
    
    const token = url.searchParams.get('token');
    const xCraftPreview = url.searchParams.get('x-craft-preview');
    const xCraftLivePreview = url.searchParams.get('x-craft-live-preview');
    
    const isPreview = Boolean(token);
    
    if (!isPreview) {
      return { isPreview: false };
    }
    
    const tokens: IPreviewTokens = {
      token: token || undefined,
      xCraftPreview: xCraftPreview || undefined,
      xCraftLivePreview: xCraftLivePreview || undefined
    };
    
    return {
      isPreview: true,
      tokens
    };
  } catch (error) {
    // During prerendering, searchParams is not available
    // Return non-preview mode to allow static generation
    return { isPreview: false };
  }
}

export function getPrerender(isPreview: boolean): boolean {
  return !isPreview;
}