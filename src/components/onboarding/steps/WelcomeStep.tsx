import { Sparkles, Zap, Target } from 'lucide-react';


const WelcomeStep = () => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
          <span className="text-white font-bold text-4xl">M</span>
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to Marathon Agent
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Your AI-powered social media assistant that works autonomously to help you create, schedule, and engage with your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="p-4 bg-indigo-50 rounded-xl">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Content</h4>
          <p className="text-sm text-gray-600">
            Generate engaging content tailored to your brand
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Autonomous Workflows</h4>
          <p className="text-sm text-gray-600">
            Set it and forget it with intelligent automation
          </p>
        </div>

        <div className="p-4 bg-pink-50 rounded-xl">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-pink-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Smart Analytics</h4>
          <p className="text-sm text-gray-600">
            Track performance and optimize your strategy
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500 pt-4">
        Let's get you set up in just a few quick steps
      </p>
    </div>
  );
};

export default WelcomeStep;
