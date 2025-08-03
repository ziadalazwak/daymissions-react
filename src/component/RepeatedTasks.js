import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TaskForm from './AddTaskForm';
import axios from 'axios';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const RepeatedTasks = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['ActiveTasks'],
    queryFn: () => axios.get('https://daymissionsapi-production.up.railway.app/api/Task', { headers: getAuthHeaders() }).then(res => res.data),
  });

  const StartTrack = (id) => {
    axios.post('https://daymissionsapi-production.up.railway.app/api/DailyTrack', {
      taskDefinationId: id
    }, { headers: getAuthHeaders() })
    .then(response => {
      console.log('Created:', response.data);
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    })
    .catch(error => {
      console.error('POST failed:', error);
    });
  };

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      axios.delete(`https://daymissionsapi-production.up.railway.app/api/Task/${id}`, { headers: getAuthHeaders() })
        .then(response => {
          console.log('Deleted:', response.data);
          queryClient.invalidateQueries({ queryKey: ['ActiveTasks'] });
        })
        .catch(error => {
          console.error('DELETE failed:', error);
          alert('Failed to delete task. Please try again.');
        });
    }
  };

  const Disable = (id) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      axios.patch(`https://daymissionsapi-production.up.railway.app/api/Task/${id}`, {}, { headers: getAuthHeaders() })
        .then(response => {
          console.log('Disabled:', response.data);
          queryClient.invalidateQueries({ queryKey: ['ActiveTasks'] });
        })
        .catch(error => {
          console.error('Disable failed:', error);
          alert('Failed to disable task. Please try again.');
        });
    }
  };
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Repeated Tasks</h2>
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
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => StartTrack(task.id)}>Start</button>
                    <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => Disable(task.id)}>Disable</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              !isLoading && !error && <li className="text-gray-500">No tasks found.</li>
            )}
         
          </ul>
          {/* Add Task Form Modal */}
          {showAddForm && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowAddForm(false)}
                aria-label="Close Add Task Form"
              >
                ×
              </button>
              <TaskForm />
            </div>
          )}
          {/* Add Task Button */}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setShowAddForm(true)}
            >
              Add Task
            </button>
          </div>
        </div>
    )

  }
export default RepeatedTasks;