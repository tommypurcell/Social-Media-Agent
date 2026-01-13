import { createContext, type ReactNode } from 'react';

const OnboardingContext = createContext<any>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    return (
        <OnboardingContext.Provider value={{ isOnboardingComplete: false }}>
            {children}
        </OnboardingContext.Provider>
    );
};
