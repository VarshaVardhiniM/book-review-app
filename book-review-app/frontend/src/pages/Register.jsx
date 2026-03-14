import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success('Account created!');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
<div className='auth-container'>
<h2>Create Account</h2>
<form onSubmit={handleSubmit}>
<input name='name'     type='text'     placeholder='Full Name'
          value={form.name}     onChange={handleChange} required />
<input name='email'    type='email'    placeholder='Email'
          value={form.email}    onChange={handleChange} required />
<input name='password' type='password' placeholder='Password (min 6)'
          value={form.password} onChange={handleChange} minLength={6} required />
<button type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
</button>
</form>
<p>Have an account? <Link to='/login'>Login</Link></p>
</div>
  );
}
