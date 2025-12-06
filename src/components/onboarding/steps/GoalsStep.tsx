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
    <div className="space-y-8 py-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          What do you want to achieve?
        </h3>
        <p className="text-slate-600">
          Select all that apply - we'll customize your experience
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Your Goals
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = formData.goals.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`group p-5 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500/20'
                  : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-50'
                    }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {goal.title}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-current" />}
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{goal.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Primary Use Case
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {useCaseOptions.map((useCase) => (
            <button
              key={useCase}
              onClick={() => updateFormData({ primaryUseCase: useCase })}
              className={`px-4 py-3.5 rounded-xl border font-medium transition-all duration-200 text-sm ${formData.primaryUseCase === useCase
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
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
