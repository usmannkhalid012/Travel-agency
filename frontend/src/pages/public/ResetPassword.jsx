import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import { resetPassword } from '../../services/authService';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetPassword(token, { password });
    toast.success('Password updated successfully');
  };

  return (
    <div className="section-padding mx-auto max-w-md">
      <PageHeader title="Reset Password" subtitle="Create a new secure password." />
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 space-y-4">
        <FormField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full">Reset password</button>
      </form>
    </div>
  );
}