import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import AgentMonitor from './pages/AgentMonitor';
import ContentLibrary from './pages/ContentLibrary';
import Workspace from './pages/Workspace';
import Planner from './pages/Planner';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('connectivity_onboarding');
    if (stored) {
      const data = JSON.parse(stored);
      setIsOnboardingComplete(data.completed);
    } else {
      setIsOnboardingComplete(false);
    }
  }, []);

  // Show loading while checking onboarding status
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/*"
          element={
            isOnboardingComplete ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<AgentMonitor />} />
                  <Route path="/contents" element={<ContentLibrary />} />
                  <Route path="/workspace/:id" element={<Workspace />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
