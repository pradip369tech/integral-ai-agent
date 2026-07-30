import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchMockData } from '../../services/mockData';
import { useNavigate } from 'react-router-dom';

export const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMockData('practice').then((data: any) => setQuestions(data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Practice Questions</h1>
        <p>Test your skills with our curated question bank.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.map(q => (
          <Card key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontFamily: 'serif', marginBottom: '12px' }}>{q.expression}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge-outline" style={{ borderColor: q.difficulty === 'hard' ? '#ef4444' : q.difficulty === 'medium' ? '#f59e0b' : '#10b981', color: q.difficulty === 'hard' ? '#ef4444' : q.difficulty === 'medium' ? '#f59e0b' : '#10b981' }}>
                  {q.difficulty}
                </span>
                {q.tags.map((t: string) => <span key={t} className="badge-outline">{t}</span>)}
              </div>
            </div>
            <Button onClick={() => navigate('/solve')}>Solve Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
