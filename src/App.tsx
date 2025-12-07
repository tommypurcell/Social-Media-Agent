
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AgentMonitor from './pages/AgentMonitor';
import ContentLibrary from './pages/ContentLibrary';
import Workspace from './pages/Workspace';
import Planner from './pages/Planner';
import Reports from './pages/Reports';
import WorkflowPlanner from './pages/WorkflowPlanner';
import SampleFeedPage from './pages/SampleFeedPage';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import AuthCallback from './pages/AuthCallback';
import Landing from './pages/Landing';
import ContentBranches from './pages/ContentBranches';
import AIStudioWorkflow from './pages/AIStudioWorkflow';
import { AgentProvider } from './lib/AgentContext';
import { OnboardingProvider } from './lib/OnboardingContext';
import { useOnboarding } from './hooks/useOnboarding';

function AppRoutes() {
  const { isOnboardingComplete } = useOnboarding();

  return (
    <Routes>
      {/* Public Landing Route */}
      <Route
        path="/"
        element={
          isOnboardingComplete ? <Navigate to="/dashboard" replace /> : <Landing />
        }
      />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <AgentMonitor />
          </MainLayout>
        )
      } />

      <Route path="/contents" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <ContentLibrary />
          </MainLayout>
        )
      } />

      <Route path="/feed" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <SampleFeedPage />
          </MainLayout>
        )
      } />

      <Route path="/workspace/:id" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <Workspace />
          </MainLayout>
        )
      } />

      <Route path="/planner" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <Planner />
          </MainLayout>
        )
      } />

      <Route path="/workflow-planner" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <WorkflowPlanner />
          </MainLayout>
        )
      } />

      <Route path="/ai-studio" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <AIStudioWorkflow />
          </MainLayout>
        )
      } />

      <Route path="/reports" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <Reports />
          </MainLayout>
        )
      } />

      <Route path="/feedback" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <Feedback />
          </MainLayout>
        )
      } />

      <Route path="/settings" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <Settings />
          </MainLayout>
        )
      } />

      <Route path="/branches" element={
        !isOnboardingComplete ? <Navigate to="/" replace /> : (
          <MainLayout>
            <ContentBranches />
          </MainLayout>
        )
      } />

      {/* Auth Callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <OnboardingProvider>
      <AgentProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AgentProvider>
    </OnboardingProvider>
  );
}

export default App;
