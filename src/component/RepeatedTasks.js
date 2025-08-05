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
    queryFn: () => axios.get('https://daymissionsapi-production.up.railway.app/api/Task/activetasks', { headers: getAuthHeaders() }).then(res => res.data),
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
    if (window.confirm('Are you sure you want to disable this task? This action cannot be undone.')) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading your repeated tasks...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="card p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Repeated Tasks</h1>
              <p className="text-gray-600">Build consistent habits and track your streaks</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-success"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {data?.filter(task => task.currentStreak > 0).length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Streaks</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data?.reduce((max, task) => Math.max(max, task.longestStreak || 0), 0) || 0}
              </div>
              <div className="text-sm text-gray-600">Longest Streak</div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data && data.length > 0 ? (
            data.map((task, index) => (
              <div
                key={task.id}
                className="card p-6 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="status-badge status-active">
                        <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="btn-primary text-sm px-3 py-1" 
                      onClick={() => StartTrack(task.id)}
                    >
                      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start
                    </button>
                    <button 
                      className="btn-secondary text-sm px-3 py-1" 
                      onClick={() => Disable(task.id)}
                    >
                      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      Disable
                    </button>
                    <button 
                      className="btn-danger text-sm px-3 py-1" 
                      onClick={() => deleteTask(task.id)}
                    >
                      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Streak Information */}
                {(task.currentStreak > 0 || task.longestStreak > 0) && (
                  <div className="space-y-4">
                    {/* Current Streak */}
                    {task.currentStreak > 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">🔥</span>
                            <div>
                              <h4 className="font-semibold text-gray-800">Current Streak</h4>
                              <p className="text-sm text-gray-600">Keep it up!</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-yellow-600">{task.currentStreak}</div>
                            <div className="text-xs text-gray-500">days</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Longest Streak */}
                    {task.longestStreak > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">🏆</span>
                            <div>
                              <h4 className="font-semibold text-gray-800">Longest Streak</h4>
                              <p className="text-sm text-gray-600">Personal best</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-purple-600">{task.longestStreak}</div>
                            <div className="text-xs text-gray-500">days</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="lg:col-span-2">
              <div className="card p-12 text-center animate-fade-in-up">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h3>
                <p className="text-gray-500 mb-6">
                  You don't have any repeated tasks yet. Start by adding some tasks!
                </p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Task Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Repeated Task</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <TaskForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepeatedTasks;