import { Sparkles, CheckCircle, Rocket } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface FinalStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const FinalStep = ({ formData }: FinalStepProps) => {
  return (
    <div className="space-y-8 text-center py-4">
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur opacity-40 group-hover:opacity-60 animate-pulse transition duration-1000"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
            <Rocket className="w-12 h-12 text-white drop-shadow-md" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          You're all set, {formData.fullName.split(' ')[0]}!
        </h3>
        <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          Your AI agent has been configured with your preferences and is ready to start maximizing your social growth.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 max-w-lg mx-auto border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <h4 className="font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Setup Summary
        </h4>

        <div className="space-y-4 text-left">
          {[
            { label: 'Account', value: formData.email },
            { label: 'Primary Use Case', value: formData.primaryUseCase },
            { label: 'Selected Goals', value: `${formData.goals.length} goal${formData.goals.length !== 1 ? 's' : ''} selected` },
            { label: 'Connected Platforms', value: formData.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') || 'None selected' },
            { label: 'Team Size', value: formData.teamSize }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 px-4 bg-slate-50/50 rounded-2xl mx-auto max-w-2xl py-6 border border-slate-100">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Next Steps</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-2xl mb-2">1️⃣</span>
            <span className="text-xs font-bold text-slate-800">Explore Dashboard</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-2xl mb-2">2️⃣</span>
            <span className="text-xs font-bold text-slate-800">Create Workflow</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-2xl mb-2">3️⃣</span>
            <span className="text-xs font-bold text-slate-800">Watch Growth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
