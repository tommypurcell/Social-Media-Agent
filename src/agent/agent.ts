import type { Workflow, Step } from './types';

// Simple agent that runs workflows
export class Agent {
  private workflows: Workflow[] = [];
  private currentWorkflow: Workflow | null = null;

  // Add a new workflow
  addWorkflow(name: string, steps: Omit<Step, 'id' | 'status'>[]): Workflow {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name,
      steps: steps.map((step, index) => ({
        ...step,
        id: `step-${index}`,
        status: 'pending'
      })),
      status: 'idle'
    };

    this.workflows.push(workflow);
    return workflow;
  }

  // Run a workflow
  async runWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    this.currentWorkflow = workflow;
    workflow.status = 'running';

    // Execute each step one by one
    for (const step of workflow.steps) {
      step.status = 'running';

      try {
        await this.executeStep(step);
        step.status = 'completed';
      } catch (error) {
        step.status = 'failed';
        console.error('Step failed:', error);
        break;
      }
    }

    workflow.status = 'completed';
    this.currentWorkflow = null;
  }

  // Execute a single step
  private async executeStep(step: Step): Promise<void> {
    console.log(`Executing: ${step.description}`);

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would add real logic for each action type
    switch (step.action) {
      case 'post':
        console.log('Posting content...');
        break;
      case 'reply':
        console.log('Replying to message...');
        break;
      case 'check_messages':
        console.log('Checking messages...');
        break;
      case 'wait':
        console.log('Waiting...');
        break;
    }
  }

  // Get all workflows
  getWorkflows(): Workflow[] {
    return this.workflows;
  }

  // Get current running workflow
  getCurrentWorkflow(): Workflow | null {
    return this.currentWorkflow;
  }
}
