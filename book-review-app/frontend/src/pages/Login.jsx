import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]           = useState({ email: '', password: '' });
  const [loading, setLoading]     = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleResetChange = (e) =>
    setResetForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success('Welcome back!');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  // Reset password submit
  const handleReset = async (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (resetForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setResetLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email:       resetForm.email,
        newPassword: resetForm.newPassword,
      });
      toast.success(data.message);
      setShowReset(false);
      setResetForm({ email: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setResetLoading(false); }
  };

  // ── Reset Password Form ──
  if (showReset) {
    return (
      <div className='auth-container'>
        <h2>Reset Password</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
          Enter your registered email and choose a new password.
        </p>
        <form onSubmit={handleReset}>
          <input
            name='email'
            type='email'
            placeholder='Your registered email'
            value={resetForm.email}
            onChange={handleResetChange}
            required
          />
          <input
            name='newPassword'
            type='password'
            placeholder='New password (min 6 characters)'
            value={resetForm.newPassword}
            onChange={handleResetChange}
            minLength={6}
            required
          />
          <input
            name='confirmPassword'
            type='password'
            placeholder='Confirm new password'
            value={resetForm.confirmPassword}
            onChange={handleResetChange}
            minLength={6}
            required
          />
          <button type='submit' disabled={resetLoading}>
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => setShowReset(false)}
            style={{
              background: 'none', border: 'none', color: 'var(--primary)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600'
            }}>
            Back to Login
          </button>
        </p>
      </div>
    );
  }

  // ── Login Form ──
  return (
    <div className='auth-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name='email'
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', marginTop: '-6px' }}>
          <button
            type='button'
            onClick={() => setShowReset(true)}
            style={{
              background: 'none', border: 'none', color: 'var(--primary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500'
            }}>
            Forgot password?
          </button>
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>No account? <Link to='/register'>Register</Link></p>
    </div>
  );
}