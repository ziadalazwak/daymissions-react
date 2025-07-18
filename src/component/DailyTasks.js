import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const DailyTasks = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => axios.get('https://localhost:7116/api/DailyTrack').then(res => res.data),
  });

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 text-red-500">Error loading tasks.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Daily Tasks</h2>
      <ul className="space-y-4 list-none p-0 m-0">
        {data && data.length > 0 ? (
          data.map(task => (
            <li
              key={task.Id}
              className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isFinished || false}
                  disabled
                  className="form-checkbox h-5 w-5 text-blue-600"
                  readOnly
                />
                <span className={`text-lg ${task.isFinished ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.taskName}</span>
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