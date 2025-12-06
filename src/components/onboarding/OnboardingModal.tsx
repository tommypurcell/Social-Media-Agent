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
  onClose?: () => void;
}

export const OnboardingModal = ({ onComplete, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    password: '',
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
        return formData.fullName.trim() !== '' && formData.email.trim() !== '' && !!formData.password && formData.password.trim() !== '';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-500 mt-1 font-medium">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            {currentStep === 0 && (
              <button
                onClick={() => onClose ? onClose() : onComplete(formData)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-2 overflow-y-auto flex-grow custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="min-h-[300px]"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
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
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-shrink-0 mt-auto">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${currentStep === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'bg-indigo-600 w-6'
                  : index < currentStep
                    ? 'bg-indigo-200 w-1.5'
                    : 'bg-slate-200 w-1.5'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform active:scale-95 ${isStepValid()
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
