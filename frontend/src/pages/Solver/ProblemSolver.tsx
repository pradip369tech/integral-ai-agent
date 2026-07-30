import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Upload, Camera, Send, FileText } from 'lucide-react';
import './Solver.css';

export const ProblemSolver: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<any>(null);

  const handleSolve = (e: React.FormEvent) => {
    e.preventDefault();
    setSolving(true);
    // Mock solving delay
    setTimeout(() => {
      setSolving(false);
      setSolution({
        steps: [
          "1. Identify the integral: ∫ x^2 dx",
          "2. Apply the power rule: ∫ x^n dx = (x^(n+1))/(n+1) + C",
          "3. Plug in n=2: (x^3)/3 + C"
        ],
        finalAnswer: "\\frac{x^3}{3} + C",
        method: "Power Rule"
      });
    }, 2000);
  };

  return (
    <div className="solver-page">
      <div className="solver-header">
        <h1>Problem Solver</h1>
        <p>Enter a mathematical expression or upload an image to get started.</p>
      </div>

      <div className="solver-grid">
        <Card className="input-card">
          <div className="upload-area">
            <Upload size={40} className="mb-4 text-muted" />
            <p>Drag & drop an image here</p>
            <span className="text-xs">or</span>
            <div className="flex gap-4 mt-4">
              <Button variant="outline"><Camera size={16} /> Take Photo</Button>
              <Button variant="secondary"><Upload size={16} /> Upload File</Button>
            </div>
          </div>
          
          <div className="divider"><span>OR</span></div>
          
          <form onSubmit={handleSolve} className="text-input-area">
            <Input 
              placeholder="e.g. \int x^2 dx"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              icon={<FileText size={18} />}
            />
            <Button type="submit" isLoading={solving} className="w-full">
              <Send size={18} /> Solve Problem
            </Button>
          </form>
        </Card>

        <Card className="solution-card">
          {solution ? (
            <div className="solution-content animate-fade-in">
              <h3>Solution Found</h3>
              <div className="method-badge">{solution.method}</div>
              
              <div className="steps-container">
                <h4>Steps:</h4>
                {solution.steps.map((step: string, i: number) => (
                  <div key={i} className="step-item">{step}</div>
                ))}
              </div>
              
              <div className="final-answer">
                <h4>Final Answer:</h4>
                <div className="math-display">{solution.finalAnswer}</div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <CalculatorPlaceholder />
              <p>Your step-by-step solution will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const CalculatorPlaceholder = () => (
  <div style={{ opacity: 0.2, marginBottom: '20px' }}>
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="16" y1="14" x2="16" y2="14.01"></line>
      <line x1="16" y1="10" x2="16" y2="10.01"></line>
      <line x1="12" y1="10" x2="12" y2="10.01"></line>
      <line x1="12" y1="14" x2="12" y2="14.01"></line>
      <line x1="8" y1="10" x2="8" y2="10.01"></line>
      <line x1="8" y1="14" x2="8" y2="14.01"></line>
      <line x1="8" y1="18" x2="16" y2="18"></line>
    </svg>
  </div>
);
