import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DailyTasks = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracks', date],
    queryFn: () => axios.get(`https://daymissionsapi-production.up.railway.app/api/DailyTrack?date=${date}`, { headers: getAuthHeaders() }).then(res => res.data),
    enabled: !!date,
  });

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 text-red-500">Error loading tasks.</div>;
  }

  const handleCheckboxClick = (taskId) => {
    axios.patch(`https://daymissionsapi-production.up.railway.app/api/DailyTrack/${taskId}`, {}, { headers: getAuthHeaders() })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['tracks', date] });
      })
      .catch(() => {
        alert('Failed to update task status.');
      });
  };

  const deleteDailyTask = (id) => {
    if (window.confirm('Are you sure you want to delete this daily task? This action cannot be undone.')) {
      axios.delete(`https://daymissionsapi-production.up.railway.app/api/DailyTrack/${id}`, { headers: getAuthHeaders() })
        .then(() => {
          console.log('Daily task deleted successfully');
          queryClient.invalidateQueries({ queryKey: ['tracks', date] });
        })
        .catch((error) => {
          console.error('DELETE failed:', error);
          alert('Failed to delete daily task. Please try again.');
        });
    }
  };
  
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <input 
        type='date' 
        placeholder='enter the day' 
        name='date' 
        value={date}
        onChange={e => setDate(e.target.value)}
        className="mb-4 px-2 py-1 border rounded"
      />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Daily Tasks</h2>
      <ul className="space-y-4 list-none p-0 m-0">
        {data && data.length > 0 ? (
          data.map(task => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isFinished || false}
                  onChange={() => handleCheckboxClick(task.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className={`text-lg ${task.isFinished ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.taskName}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" 
                  onClick={() => deleteDailyTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No tasks found.</li>
        )}
      </ul>
    </div>
  );
};

export default DailyTasks; 