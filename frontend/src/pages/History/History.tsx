import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { fetchMockData } from '../../services/mockData';
import { CheckCircle, Clock } from 'lucide-react';
import './History.css';

export const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchMockData('history').then((data: any) => setHistory(data));
  }, []);

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Your History</h1>
        <p>Review past solved problems and step-by-step solutions.</p>
      </div>

      <Card className="history-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Expression</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="animate-fade-in">
                  <td>{item.id}</td>
                  <td className="math-font">{item.expression}</td>
                  <td><span className="badge-outline">{item.method}</span></td>
                  <td>
                    <div className="status-badge success">
                      <CheckCircle size={14} /> {item.status}
                    </div>
                  </td>
                  <td>
                    <div className="date-flex">
                      <Clock size={14} /> {new Date(item.date).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
