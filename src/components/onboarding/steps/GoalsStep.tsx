import { TrendingUp, Users, Calendar, MessageCircle, CheckCircle2 } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface GoalsStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const GoalsStep = ({ formData, updateFormData }: GoalsStepProps) => {
  const goalOptions = [
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Generate and schedule engaging posts',
      icon: Calendar,
    },
    {
      id: 'audience-growth',
      title: 'Audience Growth',
      description: 'Expand reach and grow followers',
      icon: TrendingUp,
    },
    {
      id: 'engagement',
      title: 'Community Engagement',
      description: 'Respond to and interact with audience',
      icon: MessageCircle,
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Track performance and optimize',
      icon: Users,
    },
  ];

  const useCaseOptions = [
    'Personal Brand',
    'Small Business',
    'Marketing Agency',
    'Content Creator',
    'Enterprise',
    'Non-Profit',
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = formData.goals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g) => g !== goalId)
      : [...currentGoals, goalId];
    updateFormData({ goals: newGoals });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          What do you want to achieve?
        </h3>
        <p className="text-gray-600">
          Select all that apply - we'll customize your experience
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Goals (Select multiple)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = formData.goals.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {goal.title}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Use Case
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {useCaseOptions.map((useCase) => (
            <button
              key={useCase}
              onClick={() => updateFormData({ primaryUseCase: useCase })}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.primaryUseCase === useCase
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
            >
              {useCase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsStep;
