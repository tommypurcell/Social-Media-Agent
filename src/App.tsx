import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AgentMonitor from './pages/AgentMonitor';
import ContentLibrary from './pages/ContentLibrary';
import Workspace from './pages/Workspace';
import Planner from './pages/Planner';
import Reports from './pages/Reports';
import WorkflowPlanner from './pages/WorkflowPlanner';
import SampleFeedPage from './pages/SampleFeedPage';
import { AgentProvider } from './lib/AgentContext';

function App() {
  return (
    <AgentProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<AgentMonitor />} />
            <Route path="/contents" element={<ContentLibrary />} />
            <Route path="/feed" element={<SampleFeedPage />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/workflow-planner" element={<WorkflowPlanner />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </AgentProvider>
  );
}

export default App;
