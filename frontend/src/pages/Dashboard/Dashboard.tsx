import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calculator, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMockData } from '../../services/mockData';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchMockData('progress').then(() => {
      // Mock stats summary
      setStats({
        totalSolved: 42,
        streak: 5,
        timeSpent: '12h 30m'
      });
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome Back</h1>
        <p>Here's what's happening with your learning journey.</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon bg-primary"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <h3>{stats ? stats.totalSolved : '...'}</h3>
            <p>Problems Solved</p>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-secondary"><Calculator size={24} /></div>
          <div className="stat-info">
            <h3>{stats ? stats.streak : '...'} Days</h3>
            <p>Current Streak</p>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-accent"><Clock size={24} /></div>
          <div className="stat-info">
            <h3>{stats ? stats.timeSpent : '...'}</h3>
            <p>Time Learned</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-actions">
        <Card className="action-card">
          <h2>Solve a New Problem</h2>
          <p>Upload an image or type an expression to get step-by-step solutions.</p>
          <Button onClick={() => navigate('/solve')}>Go to Solver</Button>
        </Card>
        <Card className="action-card">
          <h2>Resume Practice</h2>
          <p>You were working on Integration by Parts.</p>
          <Button variant="secondary" onClick={() => navigate('/practice')}>Continue</Button>
        </Card>
      </div>
    </div>
  );
};
