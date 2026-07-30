export const mockUser = {
  id: "USR-001",
  name: "Alex Mercer",
  email: "alex.mercer@example.com",
  role: "student",
  joinDate: "2023-09-01T10:00:00Z",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

export const mockHistory = [
  {
    id: "PROB-101",
    date: "2023-11-20T14:30:00Z",
    expression: "\\int (x^2 + 3x) dx",
    method: "Power Rule",
    status: "solved",
    difficulty: "easy"
  },
  {
    id: "PROB-102",
    date: "2023-11-22T09:15:00Z",
    expression: "\\int e^x \\sin(x) dx",
    method: "Integration by Parts",
    status: "solved",
    difficulty: "hard"
  },
  {
    id: "PROB-103",
    date: "2023-11-25T16:45:00Z",
    expression: "\\int \\frac{1}{1+x^2} dx",
    method: "Standard Integral",
    status: "solved",
    difficulty: "medium"
  }
];

export const mockProgressData = [
  { name: 'Mon', problemsSolved: 2 },
  { name: 'Tue', problemsSolved: 5 },
  { name: 'Wed', problemsSolved: 3 },
  { name: 'Thu', problemsSolved: 7 },
  { name: 'Fri', problemsSolved: 4 },
  { name: 'Sat', problemsSolved: 8 },
  { name: 'Sun', problemsSolved: 6 },
];

export const mockMethodDistribution = [
  { name: 'Power Rule', value: 40 },
  { name: 'Substitution', value: 30 },
  { name: 'By Parts', value: 20 },
  { name: 'Partial Fractions', value: 10 },
];

export const mockPracticeQuestions = [
  { id: "PQ-1", expression: "\\int x^3 \\ln(x) dx", difficulty: "medium", tags: ["By Parts"] },
  { id: "PQ-2", expression: "\\int \\sin^2(x) \\cos^3(x) dx", difficulty: "hard", tags: ["Trig Substitution"] },
  { id: "PQ-3", expression: "\\int \\frac{2x}{x^2+1} dx", difficulty: "easy", tags: ["U-Substitution"] },
];

export const mockAdminStats = {
  totalUsers: 1245,
  problemsSolvedToday: 890,
  activeServers: 3,
  systemHealth: "Optimal"
};

// Simulated API calls with delay
export const fetchMockData = async (dataName: string, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (dataName) {
        case 'user': resolve(mockUser); break;
        case 'history': resolve(mockHistory); break;
        case 'progress': resolve(mockProgressData); break;
        case 'methods': resolve(mockMethodDistribution); break;
        case 'practice': resolve(mockPracticeQuestions); break;
        case 'admin': resolve(mockAdminStats); break;
        default: resolve(null);
      }
    }, delay);
  });
};
