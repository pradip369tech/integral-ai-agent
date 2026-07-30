import React, { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { fetchMockData } from '../../services/mockData';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchMockData('user').then(data => setUser(data));
  }, []);

  return (
    <header className="topbar glass-panel">
      <div className="topbar-search">
        {/* Search placeholder */}
      </div>
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <img src={user.avatar} alt="Avatar" className="avatar" />
            </>
          ) : (
            <div className="avatar-placeholder"><User size={20} /></div>
          )}
        </div>
      </div>
    </header>
  );
};
