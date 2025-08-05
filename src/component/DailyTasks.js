import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracks', date],
    queryFn: () => axios.get(`https://daymissionsapi-production.up.railway.app/api/DailyTrack?date=${date}`, { headers: getAuthHeaders() }).then(res => res.data),
    enabled: !!date,
  });

  // Calculate progress
  const completedTasks = data?.filter(task => task.isFinished)?.length || 0;
  const totalTasks = data?.length || 0;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading your daily tasks...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Tasks</h2>
            <p className="text-gray-600">Something went wrong while fetching your tasks. Please try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="card p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Missions</h1>
              <p className="text-gray-600">Track your daily progress and stay productive</p>
            </div>
            <div className="mt-4 md:mt-0">
              <input 
                type='date' 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-gray-900">
                {completedTasks} of {totalTasks} completed
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{totalTasks - completedTasks}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((task, index) => (
              <div
                key={task.id}
                className={`task-item animate-slide-in-right`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={task.isFinished || false}
                      onChange={() => handleCheckboxClick(task.id)}
                      className="checkbox-modern"
                    />
                    {task.isFinished && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-lg font-medium ${task.isFinished ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.taskName}
                    </span>
                    {task.isFinished && (
                      <div className="status-badge status-completed mt-1 inline-block">
                        Completed
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    className="btn-danger text-sm px-4 py-2" 
                    onClick={() => deleteDailyTask(task.id)}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center animate-fade-in-up">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h3>
              <p className="text-gray-500 mb-6">You don't have any tasks for this date. Start by adding some tasks!</p>
              <button className="btn-primary" onClick={() => navigate('/RepeatedTasks')}>
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Task
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {data && data.length > 0 && (
          <div className="card p-6 mt-8 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-success text-sm" onClick={() => navigate('/RepeatedTasks')}>
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </button>
              <button className="btn-secondary text-sm">
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
              <button className="btn-primary text-sm">
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTasks; 