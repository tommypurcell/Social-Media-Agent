import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { OnboardingData } from '../../hooks/useOnboarding';
import WelcomeStep from './steps/WelcomeStep';
import AccountStep from './steps/AccountStep';
import GoalsStep from './steps/GoalsStep';
import PreferencesStep from './steps/PreferencesStep';
import FinalStep from './steps/FinalStep';

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    goals: [],
    primaryUseCase: '',
    platforms: [],
    teamSize: '1',
  });

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: AccountStep, title: 'Account' },
    { component: GoalsStep, title: 'Goals' },
    { component: PreferencesStep, title: 'Preferences' },
    { component: FinalStep, title: 'Ready' },
  ];

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.fullName.trim() !== '' && formData.email.trim() !== '';
      case 2:
        return formData.goals.length > 0 && formData.primaryUseCase !== '';
      case 3:
        return formData.platforms.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            {currentStep === 0 && (
              <button
                onClick={() => onComplete(formData)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                    ? 'bg-indigo-600 w-6'
                    : index < currentStep
                      ? 'bg-indigo-300'
                      : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${isStepValid()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {currentStep === steps.length - 1 ? (
              <>
                Complete
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
