import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import RepeatedTasks from './RepeatedTasks';
import DailyTasks from './DailyTasks'
export const NavBar=()=>{
    return(
    <Router>
        <NavLink to="/">Home</NavLink>
        <NavLink to="RepeatedTasks">Tasks</NavLink>
      <Routes>
        <Route path="/" element={<DailyTasks />} />
        <Route path="/RepeatedTasks" element={<RepeatedTasks />} />
      </Routes>
    </Router>
    )
}