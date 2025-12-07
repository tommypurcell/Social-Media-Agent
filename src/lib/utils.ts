import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ContentBranch, Task } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Generate branches for a content (variations for different platforms/styles)
export const generateBranchesForContent = (task: Task | { id: string, description: string, metadata?: any }, metadata: any): ContentBranch[] => {
    const baseContent = {
        mediaUrl: metadata?.uploadedMedia || metadata?.imageUrl,
        caption: task.description || '',
        postType: (metadata?.mediaType === 'video' ? 'reel' : 'photo') as 'photo' | 'reel',
    };

    // Create original branch
    const originalBranch: ContentBranch = {
        id: `${task.id}-original`,
        name: 'Original',
        caption: baseContent.caption,
        hashtags: ['#original', '#content'],
        mediaUrl: baseContent.mediaUrl,
        platform: metadata?.platform || 'instagram',
        postType: baseContent.postType,
        isSelected: true,
        createdAt: Date.now(),
    };

    // Create platform variants
    const platforms = ['instagram', 'tiktok', 'threads'];
    // Assuming originalBranch.platform is one of the above, but type check might be loose.
    const platform = originalBranch.platform.toLowerCase();

    const variantBranches: ContentBranch[] = platforms
        .filter(p => p !== platform)
        .map((p, idx) => ({
            id: `${task.id}-${p}`,
            parentId: originalBranch.id,
            name: `${p.charAt(0).toUpperCase() + p.slice(1)} Variant`,
            caption: `${baseContent.caption} - Optimized for ${p}`,
            hashtags: [`#${p}`, '#viral', '#trending'],
            mediaUrl: baseContent.mediaUrl,
            platform: p,
            postType: baseContent.postType,
            isSelected: false,
            createdAt: Date.now() + idx * 1000,
        }));

    // Create editing style variants
    const styleVariants: ContentBranch[] = [
        {
            id: `${task.id}-casual`,
            parentId: originalBranch.id,
            name: 'Casual Style',
            caption: `${baseContent.caption} ✨ keeping it real`,
            hashtags: ['#casual', '#authentic', '#vibes'],
            mediaUrl: baseContent.mediaUrl,
            platform: originalBranch.platform,
            postType: baseContent.postType,
            isSelected: false,
            createdAt: Date.now() + 3000,
        },
        {
            id: `${task.id}-professional`,
            parentId: originalBranch.id,
            name: 'Professional Style',
            caption: `${baseContent.caption.split(':')[0]}: Professional insights and updates`,
            hashtags: ['#professional', '#business', '#growth'],
            mediaUrl: baseContent.mediaUrl,
            platform: originalBranch.platform,
            postType: baseContent.postType,
            isSelected: false,
            createdAt: Date.now() + 4000,
        },
    ];

    return [originalBranch, ...variantBranches, ...styleVariants];
};
