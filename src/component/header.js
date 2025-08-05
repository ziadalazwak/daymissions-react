import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import RepeatedTasks from './RepeatedTasks';
import IdleTasks from './IdleTasks';
import DailyTasks from './DailyTasks'
import TaskForm from './AddTaskForm'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ProtectedRoute from './ProtectedRoute';

import React, { useEffect, useState } from 'react';

const NavBarInner = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        {/* Main Navigation */}
        <nav className="gradient-primary shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-xl">Daily Missions</span>
                  </div>
                </div>
              </div>

                             {/* Desktop Navigation */}
               <div className="hidden md:block">
                 <div className="ml-10 flex items-baseline space-x-4">
                 
                   <NavLink to="/" className={({ isActive }) =>
                     `nav-link ${isActive ? 'bg-white/20' : ''}`
                   }>
                     <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                     Daily Tasks
                   </NavLink>
                   <NavLink to="/RepeatedTasks" className={({ isActive }) =>
                     `nav-link ${isActive ? 'bg-white/20' : ''}`
                   }>
                     <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                     </svg>
                     Tasks
                   </NavLink>
                   <NavLink to="/IdleTasks" className={({ isActive }) =>
                     `nav-link ${isActive ? 'bg-white/20' : ''}`
                   }>
                     <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     Idle Tasks
                   </NavLink>
                 </div>
               </div>

              {/* User Menu */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {!isLoggedIn ? (
                    <div className="flex space-x-4">
                      <NavLink to="/login" className="btn-secondary text-sm">
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                      </NavLink>
                      <NavLink to="/register" className="btn-primary text-sm">
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register
                      </NavLink>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <button className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium">User</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <button 
                        onClick={handleLogout} 
                        className="btn-danger text-sm"
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

                     {/* Mobile menu */}
           {isMobileMenuOpen && (
             <div className="md:hidden animate-fade-in-up">
               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-sm">
                
                 <NavLink to="/" className={({ isActive }) =>
                   `block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200 ${isActive ? 'bg-white/20' : ''}`
                 }>
                   Daily Tasks
                 </NavLink>
                 <NavLink to="/RepeatedTasks" className={({ isActive }) =>
                   `block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200 ${isActive ? 'bg-white/20' : ''}`
                 }>
                   Tasks
                 </NavLink>
                 <NavLink to="/IdleTasks" className={({ isActive }) =>
                   `block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200 ${isActive ? 'bg-white/20' : ''}`
                 }>
                   Idle Tasks
                 </NavLink>
                {!isLoggedIn ? (
                  <>
                    <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200">
                      Login
                    </NavLink>
                    <NavLink to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200">
                      Register
                    </NavLink>
                  </>
                ) : (
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors duration-200"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

                 {/* Page Content */}
         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
           <Routes>
 
             <Route path="/" element={
               <ProtectedRoute>
                 <DailyTasks />
               </ProtectedRoute>
             } />
             <Route path='/AddTaskForm' element={
               <ProtectedRoute>
                 <TaskForm/>
               </ProtectedRoute>
             }/>
             <Route path="/RepeatedTasks" element={
               <ProtectedRoute>
                 <RepeatedTasks />
               </ProtectedRoute>
             } />
             <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
             <Route path="/register" element={<RegisterForm />} />
             <Route path="/IdleTasks" element={
               <ProtectedRoute>
                 <IdleTasks/>
               </ProtectedRoute>
             }/>
           </Routes>
         </div>
        </>
    )
}

export const NavBar = () => (
  <Router>
    <NavBarInner />
  </Router>
);