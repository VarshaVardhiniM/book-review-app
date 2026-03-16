import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep]                       = useState(1);
  const [email, setEmail]                     = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer]   = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]                 = useState(false);

  // Step 1 — Get security question for email
  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/get-question', { email });
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally { setLoading(false); }
  };

  // Step 2 — Verify answer + set new password
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email, securityAnswer, newPassword,
      });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className='auth-container'>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
        {[1, 2].map(s => (
          <div key={s} style={{
            width: '48px', height: '6px', borderRadius: '3px',
            background: s <= step ? 'var(--primary)' : 'var(--border)',
            transition: 'background 0.3s ease'
          }} />
        ))}
      </div>

      {/* Step 1 — Enter Email */}
      {step === 1 && (
        <>
          <h2>Reset Password</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Enter your registered email to get your security question.
          </p>
          <form onSubmit={handleGetQuestion}>
            <input
              type='email'
              placeholder='Your registered email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type='submit' disabled={loading}>
              {loading ? 'Finding account...' : 'Continue'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to='/login' style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Back to Login
            </Link>
          </p>
        </>
      )}

      {/* Step 2 — Answer security question + new password */}
      {step === 2 && (
        <>
          <h2>Verify & Reset</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Answer your security question to reset your password.
          </p>
          <form onSubmit={handleReset}>

            {/* Security question display */}
            <div style={{
              background: 'var(--bg)', border: '2px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '4px'
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px', fontWeight: '500' }}>
                Your security question
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: '600' }}>
                {securityQuestion}
              </p>
            </div>

            <input
              type='text'
              placeholder='Your answer'
              value={securityAnswer}
              onChange={e => setSecurityAnswer(e.target.value)}
              required
            />

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '4px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '10px', fontWeight: '500' }}>
                New Password
              </p>
              <input
                type='password'
                placeholder='New password (min 6 characters)'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
              <input
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type='submit' disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => { setStep(1); setSecurityQuestion(''); setSecurityAnswer(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
              Back
            </button>
          </p>
        </>
      )}

    </div>
  );
}