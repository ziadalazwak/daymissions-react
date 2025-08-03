import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
  userName: yup.string().required('Name is required'),
 
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm = ({ onRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    setSuccess('');
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await axios.post('https://daymissionsapi-production.up.railway.app/api/auth/register', data);
      setSuccess('Registration successful!');
      if (onRegister) onRegister(response.data);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            {...register('UserName')}
          />
          {errors.UserName && <div className="text-red-500 text-sm">{errors.UserName.message}</div>}
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
        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>}
        </div>
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 