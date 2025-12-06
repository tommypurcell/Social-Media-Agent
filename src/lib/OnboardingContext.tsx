
import { createContext, useState, type ReactNode } from 'react';

const ONBOARDING_KEY = 'social_media_agent_onboarding_completed';

export interface OnboardingData {
    fullName: string;
    email: string;
    password?: string;
    goals: string[];
    primaryUseCase: string;
    platforms: string[];
    teamSize: string;
}

interface OnboardingContextType {
    isOnboardingComplete: boolean;
    onboardingData: OnboardingData | null;
    completeOnboarding: (data: OnboardingData) => void;
    resetOnboarding: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
        return localStorage.getItem(ONBOARDING_KEY) === 'true';
    });

    const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(() => {
        const stored = localStorage.getItem('onboarding_data');
        return stored ? JSON.parse(stored) : null;
    });

    const completeOnboarding = (data: OnboardingData) => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        localStorage.setItem('onboarding_data', JSON.stringify(data));
        setOnboardingData(data);
        setIsOnboardingComplete(true);
    };

    const resetOnboarding = () => {
        localStorage.removeItem(ONBOARDING_KEY);
        localStorage.removeItem('onboarding_data');
        setIsOnboardingComplete(false);
        setOnboardingData(null);
    };

    return (
        <OnboardingContext.Provider value={{ isOnboardingComplete, onboardingData, completeOnboarding, resetOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    );
};
