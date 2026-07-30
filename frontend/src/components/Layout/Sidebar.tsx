import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, History, TrendingUp, BookOpen, Settings, ShieldAlert } from 'lucide-react';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Solver', path: '/solve', icon: <Calculator size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Progress', path: '/progress', icon: <TrendingUp size={20} /> },
    { name: 'Practice', path: '/practice', icon: <BookOpen size={20} /> },
    { name: 'Profile', path: '/profile', icon: <Settings size={20} /> },
    { name: 'Admin', path: '/admin', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <span className="logo-icon">∫</span>
        <h2>IntegralAI</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
