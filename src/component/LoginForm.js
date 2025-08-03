import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
  userName: yup.string().required('Name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginForm = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    setSuccess('');
    try {
      const response = await axios.post('https://daymissionsapi-production.up.railway.app/api/Auth/login', data);
      setSuccess('Login successful!');
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        if (onLogin) onLogin(response.data.token);
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            {...register('userName')}
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            {...register('password')}
          />
          {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
        </div>
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 