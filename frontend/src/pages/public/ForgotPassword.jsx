import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import { forgotPassword } from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await forgotPassword({ email });
    toast.success('Reset link sent if the email exists');
  };

  return (
    <div className="section-padding mx-auto max-w-md">
      <PageHeader title="Forgot Password" subtitle="Request a reset link and continue securely." />
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 space-y-4">
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary w-full">Send reset link</button>
      </form>
    </div>
  );
}