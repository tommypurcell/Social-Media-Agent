import type { WorkflowConfig, PostDraft, Platform } from "../types";

// Lightweight mock implementations so the AI Studio module works without external API deps.

export const generatePostContent = async (
  topic: string,
  platform: Platform,
  media?: { data: string; mimeType: string }
) => {
  const isVideo = media?.mimeType?.startsWith('video/');
  const postType = isVideo ? 'Reel' : 'Photo Post';
  return {
    type: postType,
    captionStarter: topic ? `Quick take on ${topic}` : 'Fresh drop',
    generatedCaption: `Draft for ${platform}: ${topic || 'New post'} ✨`,
    hashtags: ['#content', '#growth', '#ai', '#social', '#trend']
  };
};

export const generatePostPlan = async (_config: WorkflowConfig): Promise<PostDraft[]> => {
  return [];
};

export const generateImageForPost = async (post: PostDraft): Promise<string> => {
  const fallback = encodeURIComponent(post.topic || 'content');
  return `https://placehold.co/800x800/png?text=${fallback}`;
};
