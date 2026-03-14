import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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

  return (
<div className='auth-container'>
<h2>Login</h2>
<form onSubmit={handleSubmit}>
<input name='email'    type='email'    placeholder='Email'
          value={form.email}    onChange={handleChange} required />
<input name='password' type='password' placeholder='Password'
          value={form.password} onChange={handleChange} required />
<button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
</button>
</form>
<p>No account? <Link to='/register'>Register</Link></p>
</div>
  );
}
