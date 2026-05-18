import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormField from '../../components/FormField';
import { register } from '../../redux/slices/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await dispatch(register(form)).unwrap();
      navigate(response.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Registration failed');
    }
  };

  return (
    <div className="section-padding mx-auto max-w-md">
      <div className="glass-card rounded-3xl p-8">
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-slate-300">Join the system as a customer or admin-managed account.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button className="btn-primary w-full">Register</button>
        </form>
        <p className="mt-5 text-sm text-slate-400">Already have an account? <Link to="/login" className="text-white">Login</Link></p>
      </div>
    </div>
  );
}