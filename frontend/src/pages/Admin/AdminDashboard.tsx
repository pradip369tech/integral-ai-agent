import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { fetchMockData } from '../../services/mockData';
import { Users, Server, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchMockData('admin').then((data) => setStats(data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px', color: '#3b82f6' }}><Users size={24} /></div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{stats?.totalUsers || '...'}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Total Users</p>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: '#10b981' }}><Activity size={24} /></div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{stats?.problemsSolvedToday || '...'}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Solved Today</p>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px', color: '#8b5cf6' }}><Server size={24} /></div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{stats?.activeServers || '...'}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Active Nodes</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3>Recent System Alerts</h3>
        <div style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
          <p>No recent alerts. System health is {stats?.systemHealth || 'checking...'}</p>
        </div>
      </Card>
    </div>
  );
};
