import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import RepeatedTasks from './RepeatedTasks';
import DailyTasks from './DailyTasks'
import TaskForm from './AddTaskForm'
export const NavBar=()=>{
    return(
    <Router>
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
        </nav>
        <Routes>
          <Route path="/" element={<DailyTasks />} />
          <Route path='/AddTaskForm' element={<TaskForm/>}/>
          <Route path="/RepeatedTasks" element={<RepeatedTasks />} />
        </Routes>
    </Router>
    )
}