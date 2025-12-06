// Simple types for our agent
export type Workflow = {
  id: string;
  name: string;
  steps: Step[];
  status: 'idle' | 'running' | 'completed';
};

export type Step = {
  id: string;
  action: 'post' | 'reply' | 'check_messages' | 'wait';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};
