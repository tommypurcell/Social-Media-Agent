import { User, Mail, Lock } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface AccountStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const AccountStep = ({ formData, updateFormData }: AccountStepProps) => {
  return (
    <div className="space-y-8 max-w-lg mx-auto py-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Create Your Profile
        </h3>
        <p className="text-slate-600">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Enter your full name"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="you@example.com"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="password"
              id="password"
              value={formData.password || ''}
              onChange={(e) => updateFormData({ password: e.target.value })}
              placeholder="Create a secure password"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-700 mb-2">
            Team Size
          </label>
          <div className="relative">
            <select
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => updateFormData({ teamSize: e.target.value })}
              className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 appearance-none cursor-pointer"
            >
              <option value="1">Just me</option>
              <option value="2-5">2-5 people</option>
              <option value="6-10">6-10 people</option>
              <option value="11-50">11-50 people</option>
              <option value="51+">51+ people</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
        <p className="text-sm text-indigo-900/80 leading-relaxed">
          <span className="font-semibold block mb-1">🔒 Privacy First</span>
          Your information is stored locally and securely. We use it only to personalize your Connectivity experience.
        </p>
      </div>
    </div>
  );
};

export default AccountStep;
