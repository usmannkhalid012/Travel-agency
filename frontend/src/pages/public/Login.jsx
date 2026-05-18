import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { login } from '../../redux/slices/authSlice';
import { loginValidation } from '../../utils/validation';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = loginValidation(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      const response = await dispatch(login(form)).unwrap();
      navigate(response.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="section-padding mx-auto max-w-md">
      <div className="glass-card rounded-3xl p-8">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-300">Sign in to manage bookings and access your dashboard.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.rememberMe} onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })} /> Remember me
          </label>
          <button className="btn-primary w-full">Login</button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
          <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
          <Link to="/register" className="hover:text-white">Create account</Link>
        </div>
        {user && <p className="mt-4 text-xs text-violet-200">Signed in as {user.email}</p>}
      </div>
    </div>
  );
}