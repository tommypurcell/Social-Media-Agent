// Media Generation Service using Gemini AI and Pexels API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PEXELS_API_KEY = 'rZL3fQ9F6gqXGP8K1v7MfCNYqJ2pL1jY8J6MxYG5D8fGDz6F8sL6Z5zK';

interface GeneratedMedia {
    type: 'image' | 'video';
    url: string;
    prompt: string;
    duration?: number;
}

// Generate enhanced prompt using Gemini
async function enhancePromptWithGemini(topic: string, platform: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not found, using original topic');
        return topic;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Create a detailed, visually descriptive prompt for generating an image or video about "${topic}" for ${platform}. The prompt should be optimized for image/video generation AI. Focus on visual elements, lighting, composition, and mood. Keep it under 100 words. Only return the prompt, no explanation.`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const enhancedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (enhancedPrompt) {
            console.log('Enhanced prompt:', enhancedPrompt);
            return enhancedPrompt;
        }

        return topic;
    } catch (error) {
        console.error('Error enhancing prompt with Gemini:', error);
        return topic;
    }
}

// Get images from Pexels
async function getPexelsImage(query: string): Promise<string> {
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large2x || data.photos[0].src.large;
        }

        // Final fallback
        return `https://placehold.co/1080x1080/6366f1/ffffff?text=${encodeURIComponent(query.substring(0, 30))}`;
    } catch (error) {
        console.error('Error fetching from Pexels:', error);
        return `https://placehold.co/1080x1080/6366f1/ffffff?text=${encodeURIComponent(query.substring(0, 30))}`;
    }
}

// Get videos from Pexels
async function getPexelsVideo(query: string): Promise<string> {
    try {
        const response = await fetch(
            `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );

        const data = await response.json();

        if (data.videos && data.videos.length > 0) {
            const video = data.videos[0];
            // Get the smallest video file (for 5 sec preview)
            const videoFile = video.video_files?.find((f: any) => f.quality === 'sd') || video.video_files?.[0];
            if (videoFile) {
                return videoFile.link;
            }
        }

        // Fallback to placeholder
        return `https://placehold.co/1080x1080/6366f1/ffffff?text=${encodeURIComponent('Video: ' + query.substring(0, 25))}`;
    } catch (error) {
        console.error('Error fetching video from Pexels:', error);
        return `https://placehold.co/1080x1080/6366f1/ffffff?text=${encodeURIComponent('Video: ' + query.substring(0, 25))}`;
    }
}

/**
 * Generate media (image or video) for a post
 * Uses Gemini to enhance prompts, then Pexels to get actual stock media
 */
export async function generateMedia(
    topic: string,
    platform: string,
    mediaType: 'image' | 'video' = 'image'
): Promise<GeneratedMedia> {
    console.log(`Generating ${mediaType} for topic: "${topic}" on ${platform}`);

    // Step 1: Enhance prompt with Gemini
    const enhancedPrompt = await enhancePromptWithGemini(topic, platform);

    // Step 2: Get actual media from Pexels
    let mediaUrl: string;

    if (mediaType === 'video') {
        mediaUrl = await getPexelsVideo(enhancedPrompt);

        return {
            type: 'video',
            url: mediaUrl,
            prompt: enhancedPrompt,
            duration: 5 // 5 seconds as requested
        };
    } else {
        mediaUrl = await getPexelsImage(enhancedPrompt);

        return {
            type: 'image',
            url: mediaUrl,
            prompt: enhancedPrompt
        };
    }
}

/**
 * Generate caption using Gemini
 */
export async function generateCaption(
    topic: string,
    platform: string,
    mediaType: 'image' | 'video'
): Promise<string> {
    if (!GEMINI_API_KEY) {
        return `Check out this amazing ${mediaType} about ${topic}! 🚀✨`;
    }

    try {
        const platformStyles = {
            instagram: 'Instagram-style with emojis and hashtags',
            tiktok: 'TikTok-style, short, punchy, and trending',
            threads: 'Threads-style, conversational and authentic'
        };

        const style = platformStyles[platform as keyof typeof platformStyles] || platformStyles.instagram;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Write a ${style} caption for a ${mediaType} post about "${topic}". Keep it under 150 characters. Include relevant emojis. Only return the caption, no quotes or explanation.`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const caption = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (caption) {
            return caption;
        }

        return `Check out this amazing ${mediaType} about ${topic}! 🚀✨`;
    } catch (error) {
        console.error('Error generating caption with Gemini:', error);
        return `Check out this amazing ${mediaType} about ${topic}! 🚀✨`;
    }
}

export default {
    generateMedia,
    generateCaption
};
