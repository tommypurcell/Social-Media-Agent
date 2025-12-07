import { useState } from 'react';
import WorkflowConfigModal from '../ai-studio/components/WorkflowConfigModal';
import WorkflowPlanner from '../ai-studio/components/WorkflowPlanner';
import AgentSimulation from '../ai-studio/components/AgentSimulation';
import type { WorkflowConfig as StudioWorkflowConfig, PostDraft, Platform } from '../ai-studio/types';
import { useAgentContext } from '../lib/AgentContext';

type Step = 'config' | 'planning' | 'simulation';

const createEmptyDrafts = (config: StudioWorkflowConfig): PostDraft[] => {
  return Array.from({ length: config.postCount }).map((_, idx) => ({
    id: idx + 1,
    platform: config.platforms[0] || 'Instagram',
    topic: '',
    type: 'Photo Post',
    captionStarter: '',
    generatedCaption: '',
    hashtags: [],
    isGeneratingImage: false,
    isGeneratingText: false,
    mediaType: 'image',
    scheduledTime: ''
  }));
};

const platformToInternal = (p: Platform): 'instagram' | 'tiktok' | 'threads' => {
  switch (p) {
    case 'Instagram': return 'instagram';
    case 'Tiktok': return 'tiktok';
    case 'Threads': return 'threads';
    default: return 'instagram';
  }
};

const AIStudioWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<Step>('config');
  const [config, setConfig] = useState<StudioWorkflowConfig | null>(null);
  const [posts, setPosts] = useState<PostDraft[]>([]);
  const { addTask, toggleAgent, state } = useAgentContext();

  const handleStartWorkflow = (newConfig: StudioWorkflowConfig) => {
    setConfig(newConfig);
    setPosts(createEmptyDrafts(newConfig));
    setCurrentStep('planning');
  };

  const handleFinishPlanning = (finalPosts: PostDraft[]) => {
    if (!config) {
      setPosts(finalPosts);
      setCurrentStep('simulation');
      return;
    }

    // Expand posts across selected platforms
    const expanded: PostDraft[] = [];
    let nextId = Math.max(...finalPosts.map(p => p.id), 0) + 1;

    finalPosts.forEach(originalPost => {
      expanded.push(originalPost);
      config.platforms.forEach(target => {
        if (target !== originalPost.platform) {
          expanded.push({
            ...originalPost,
            id: nextId++,
            platform: target,
            type: target === 'Tiktok' ? 'Reel' : originalPost.type
          });
        }
      });
    });

    setPosts(expanded);

    // Push into agent task queue
    expanded.forEach(post => {
      const platform = platformToInternal(post.platform);
      const caption = post.generatedCaption || post.captionStarter || post.topic || 'New post';
      addTask(
        `Post to ${platform}: ${caption.slice(0, 40)}...`,
        'post_content',
        {
          platform,
          caption,
          mediaType: post.mediaType === 'video' || post.type === 'Reel' ? 'video' : 'image',
          imageUrl: post.imageUrl,
          uploadedMedia: post.imageUrl
        }
      );
    });

    if (!state.isActive) {
      toggleAgent();
    }

    setCurrentStep('simulation');
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 text-gray-800 font-sans custom-scrollbar">
      {currentStep === 'config' && (
        <WorkflowConfigModal onStart={handleStartWorkflow} />
      )}

      {currentStep === 'planning' && config && (
        <WorkflowPlanner
          config={config}
          initialPosts={posts}
          onBack={() => setCurrentStep('config')}
          onFinish={handleFinishPlanning}
        />
      )}

      {currentStep === 'simulation' && (
        <AgentSimulation
          posts={posts}
          onReset={() => {
            setCurrentStep('config');
            setPosts([]);
          }}
        />
      )}
    </div>
  );
};

export default AIStudioWorkflow;
