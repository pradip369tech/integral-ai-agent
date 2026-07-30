import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { fetchMockData } from '../../services/mockData';
import { User, Mail } from 'lucide-react';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchMockData('user').then((data) => setUser(data));
  }, []);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <img src={user.avatar} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--primary-color)', margin: '0 auto 16px' }} />
        <h1>{user.name}</h1>
        <p>{user.role.toUpperCase()}</p>
      </div>

      <Card>
        <h3 style={{ marginBottom: '24px' }}>Account Settings</h3>
        <form>
          <Input label="Full Name" defaultValue={user.name} icon={<User size={18} />} />
          <Input label="Email Address" defaultValue={user.email} icon={<Mail size={18} />} />
          <Button style={{ marginTop: '16px' }}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};
