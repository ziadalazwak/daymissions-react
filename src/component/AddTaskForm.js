import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const schema = yup.object().shape({
  Name: yup.string().required('Task name is required'),
  active: yup.boolean().required('Active status is required'),
});

const TaskForm = () => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (task) =>
      axios.post('https://localhost:7116/api/Task', task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ActiveTasks'] });
     
    },
    onError: () => {
      alert('Failed to add task. Please try again.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Daily Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter the Task Name"
          {...register('Name')}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('active')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Active</span>
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;