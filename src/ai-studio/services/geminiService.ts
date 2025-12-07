import type { WorkflowConfig, PostDraft, Platform } from "../types";

// NOTE: Real implementation uses @google/genai, but it is not installed.
// Using mock implementation for now to satisfy the build and demo UI.

export const generatePostContent = async (
    topic: string,
    platform: Platform,
    businessContext: { name: string, description: string },
    media?: { data: string, mimeType: string }
) => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`[MOCK] Generating content for ${platform} on topic: "${topic}"`);
    console.log(`[MOCK] Business: ${businessContext.name}`);
    if (media) console.log(`[MOCK] Analyzing media: ${media.mimeType}, size: ${media.data.length} chars`);

    // Mock Response
    return {
        type: media?.mimeType?.startsWith('video') ? 'Reel' : 'Photo Post',
        captionStarter: `Visuals of ${topic || 'lifestyle content'}`,
        generatedCaption: `Check out this amazing update about ${topic || 'life'}! ✨ We are so excited to share this with you. Let us know what you think in the comments below! 👇 #trending #viral`,
        hashtags: ['#fyp', '#trending', `#${platform.replace(/\s/g, '').toLowerCase()}`, '#viral', '#new']
    };
};

export const generatePostPlan = async (_config: WorkflowConfig): Promise<PostDraft[]> => {
    // Currently bypassed in App logic, but defined for completeness
    return [];
};

export const generateImageForPost = async (post: PostDraft): Promise<string> => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`[MOCK] Generating image for topic: "${post.topic}"`);

    // Return a random Lorem Picsum image to simulate generation
    return `https://picsum.photos/800/800?random=${post.id}-${Date.now()}`;
};
