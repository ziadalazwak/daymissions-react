import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const IdleTasks = () => {

  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['IdleTasks'],
    queryFn: () => axios.get('https://daymissionsapi-production.up.railway.app/api/Task/idletasks', { headers: getAuthHeaders() }).then(res => res.data),
  });



  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      axios.delete(`https://daymissionsapi-production.up.railway.app/api/Task/${id}`, { headers: getAuthHeaders() })
        .then(response => {
          console.log('Deleted:', response.data);
          queryClient.invalidateQueries({ queryKey: ['IdleTasks'] });
        })
        .catch(error => {
          console.error('DELETE failed:', error);
          alert('Failed to delete task. Please try again.');
        });
    }
  };

  const Active = (id) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      axios.patch(`https://daymissionsapi-production.up.railway.app/api/Task/${id}`, {}, { headers: getAuthHeaders() })
        .then(response => {
          console.log('Disabled:', response.data);
          queryClient.invalidateQueries({ queryKey: ['IdleTasks'] });
        })
        .catch(error => {
          console.error('Disable failed:', error);
          alert('Failed to disable task. Please try again.');
        });
    }
  };
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Idle Tasks</h2>
          <ul className="space-y-4 list-none p-0 m-0">

            {isLoading && <li className="text-gray-500">Loading tasks...</li>}
            {error && <li className="text-red-500">Error fetching tasks.</li>}
            {data && !isLoading && !error && data.length > 0 ? (
              data.map(task => (
                <li key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
                    {(task.currentStreak > 0 || task.longestStreak > 0) && (
                      <div className="flex items-center mt-2 space-x-4">
                        {task.currentStreak > 0 && (
                          <div className="flex items-center text-sm text-yellow-500">
                            <span role="img" aria-label="current streak" className="mr-1 text-lg">🔥</span>
                            <strong>{task.currentStreak}</strong>
                          </div>
                        )}
                        {task.longestStreak > 0 && (
                          <div className="flex items-center text-sm text-red-500">
                            <span role="img" aria-label="longest streak" className="mr-1 text-lg">🏆</span>
                            <strong>{task.longestStreak}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    
                    <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => Active(task.id)}>Active</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              !isLoading && !error && <li className="text-gray-500">No tasks found.</li>
            )}
         
          </ul>
         
        </div>
    )

  }
export default IdleTasks;