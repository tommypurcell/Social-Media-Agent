import { useState } from 'react';
import { Agent } from './agent';
import type { Workflow } from './types';

// Create a single agent instance
const agent = new Agent();

// Simple React hook to use the agent
export function useAgent() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // Create a new workflow
  const createWorkflow = (name: string) => {
    // Example workflow with simple steps
    const workflow = agent.addWorkflow(name, [
      { action: 'check_messages', description: 'Check for new messages' },
      { action: 'post', description: 'Create and post content' },
      { action: 'wait', description: 'Wait 5 minutes' },
      { action: 'reply', description: 'Reply to comments' }
    ]);

    setWorkflows([...agent.getWorkflows()]);
    return workflow;
  };

  // Run a workflow
  const runWorkflow = async (workflowId: string) => {
    await agent.runWorkflow(workflowId);
    setWorkflows([...agent.getWorkflows()]);
  };

  return {
    workflows,
    createWorkflow,
    runWorkflow
  };
}
