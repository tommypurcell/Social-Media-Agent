import { CheckCircle2 } from 'lucide-react';
import type { OnboardingData } from '../../../hooks/useOnboarding';

interface PreferencesStepProps {
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const PreferencesStep = ({ formData, updateFormData }: PreferencesStepProps) => {
  const platformOptions = [
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'bg-black',
      description: 'Micro-blogging platform',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'in',
      color: 'bg-blue-600',
      description: 'Professional networking',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'IG',
      color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      description: 'Photo & video sharing',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'f',
      color: 'bg-blue-500',
      description: 'Social networking',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: 'TT',
      color: 'bg-black',
      description: 'Short-form video',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: 'YT',
      color: 'bg-red-600',
      description: 'Video platform',
    },
  ];

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = formData.platforms || [];
    const newPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter((p) => p !== platformId)
      : [...currentPlatforms, platformId];
    updateFormData({ platforms: newPlatforms });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Which platforms do you use?
        </h3>
        <p className="text-slate-600">
          Select the social media platforms you want to manage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {platformOptions.map((platform) => {
          const isSelected = formData.platforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500/20'
                : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  {platform.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-bold text-lg mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                    {platform.name}
                  </h4>
                  <p className="text-sm text-slate-500">{platform.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-current" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50/50 border border-amber-100 rounded-xl max-w-2xl mx-auto">
        <p className="text-sm text-amber-900/80 leading-relaxed text-center">
          <span className="font-semibold">✨ Pro Tip:</span> You can always connect more accounts later in your settings. This just helps us tailor your initial dashboard.
        </p>
      </div>
    </div>
  );
};

export default PreferencesStep;
