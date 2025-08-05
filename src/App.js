import RepeatedTasks from './component/RepeatedTasks';
import DailyTasks from './component/DailyTasks';
import { NavBar } from './component/header';
import { QueryClientProvider,QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
function App() {
  return (
    <div className="min-h-screen">
      <QueryClientProvider client={queryClient}>
        <NavBar/>
      </QueryClientProvider>
    </div>
  );
}

export default App;
