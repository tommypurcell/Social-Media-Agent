import { Sparkles, CheckCircle, Rocket } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface FinalStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const FinalStep = ({ formData }: FinalStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200 animate-pulse">
          <Rocket className="w-10 h-10 text-white" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          You're all set, {formData.fullName.split(' ')[0]}!
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Your Marathon Agent is ready to transform your social media management
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 max-w-lg mx-auto border border-indigo-100">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Your Setup Summary
        </h4>

        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Account</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Primary Use Case</p>
              <p className="text-sm text-gray-600">{formData.primaryUseCase}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Selected Goals</p>
              <p className="text-sm text-gray-600">{formData.goals.length} goal{formData.goals.length !== 1 ? 's' : ''} selected</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Connected Platforms</p>
              <p className="text-sm text-gray-600">
                {formData.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Team Size</p>
              <p className="text-sm text-gray-600">{formData.teamSize}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-1 bg-gradient-to-r from-transparent to-indigo-200 rounded"></div>
          <span>What happens next?</span>
          <div className="w-8 h-1 bg-gradient-to-l from-transparent to-indigo-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-1">1️⃣</div>
            <p className="text-xs font-medium text-gray-700">Explore the dashboard</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-1">2️⃣</div>
            <p className="text-xs font-medium text-gray-700">Create your first workflow</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-1">3️⃣</div>
            <p className="text-xs font-medium text-gray-700">Watch the magic happen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
