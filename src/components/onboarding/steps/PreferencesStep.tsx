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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Which platforms do you use?
        </h3>
        <p className="text-gray-600">
          Select the social media platforms you want to manage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {platformOptions.map((platform) => {
          const isSelected = formData.platforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`group relative p-5 rounded-xl border-2 transition-all ${isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${platform.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {platform.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {platform.name}
                  </h4>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg max-w-2xl mx-auto">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> You can connect your accounts later in settings. This selection helps us personalize your dashboard.
        </p>
      </div>
    </div>
  );
};

export default PreferencesStep;
