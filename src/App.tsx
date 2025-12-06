import { useAgent } from './lib/agent';
import { Dashboard } from './components/Dashboard';

function App() {
  const { state, toggleAgent, generateSummary } = useAgent();

  return (
    <Dashboard state={state} onToggle={toggleAgent} onGenerateSummary={generateSummary} />
  );
}

export default App;
