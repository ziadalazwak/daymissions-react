import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import RepeatedTasks from './RepeatedTasks';
import DailyTasks from './DailyTasks'
import TaskForm from './AddTaskForm'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import React, { useEffect, useState } from 'react';

const NavBarInner = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
      const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Handle login callback
    const handleLogin = () => {
      setIsLoggedIn(true);
      navigate('/');
      window.location.reload();
    };

    // Handle logout
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.location.reload();
    };

    return(
        <>
        <nav className="bg-blue-600 p-4 shadow-md flex items-center justify-between">
          <div className="flex space-x-6">
            <NavLink to="/" className={({ isActive }) =>
              `text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200 ${isActive ? 'bg-blue-800' : ''}`
            }>
              Home
            </NavLink>
            <NavLink to="/RepeatedTasks" className={({ isActive }) =>
              `text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200 ${isActive ? 'bg-blue-800' : ''}`
            }>
              Tasks
            </NavLink>
          </div>
          {!isLoggedIn ? (
            <div className="flex space-x-4">
              <NavLink to="/login" className={({ isActive }) =>
                `text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200 ${isActive ? 'bg-blue-800' : ''}`
              }>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) =>
                `text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200 ${isActive ? 'bg-blue-800' : ''}`
              }>
                Register
              </NavLink>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Logout</button>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<DailyTasks />} />
          <Route path='/AddTaskForm' element={<TaskForm/>}/>
          <Route path="/RepeatedTasks" element={<RepeatedTasks />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
        </>
    )
}

export const NavBar = () => (
  <Router>
    <NavBarInner />
  </Router>
);