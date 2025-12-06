import { useContext } from 'react';
import { OnboardingContext, type OnboardingData } from '../lib/OnboardingContext';

export type { OnboardingData };

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
