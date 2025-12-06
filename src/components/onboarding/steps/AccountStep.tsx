import { User, Mail } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface AccountStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const AccountStep = ({ formData, updateFormData }: AccountStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h3>
        <p className="text-gray-600">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="space-y-5 max-w-md mx-auto">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Enter your full name"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="you@example.com"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
            Team Size
          </label>
          <select
            id="teamSize"
            value={formData.teamSize}
            onChange={(e) => updateFormData({ teamSize: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
          >
            <option value="1">Just me</option>
            <option value="2-5">2-5 people</option>
            <option value="6-10">6-10 people</option>
            <option value="11-50">11-50 people</option>
            <option value="51+">51+ people</option>
          </select>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg max-w-md mx-auto">
        <p className="text-sm text-blue-800">
          <strong>Privacy First:</strong> Your information is stored locally and securely. We use it only to personalize your Marathon Agent experience.
        </p>
      </div>
    </div>
  );
};

export default AccountStep;
