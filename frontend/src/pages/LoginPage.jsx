import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('student1');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'ROLE_FINANCE_STAFF') {
        navigate('/finance/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleUser) => {
    setUsername(roleUser);
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Portal Header */}
        <div style={{
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          padding: '2rem 1.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff' }}>
            APEX GLOBAL UNIVERSITY
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Fee Management ERP System
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username or Registration ID</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Portal <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Persona Switcher for easy demo */}
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
              Demo Quick-Fill Accounts (Click to test):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('student1')}
              >
                🎓 Student (Due ₹30k)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('student2')}
              >
                🎓 Student (Paid)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('finance1')}
              >
                💼 Finance Staff
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('admin')}
              >
                🛡️ Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div style={{
          padding: '0.85rem 1.75rem',
          backgroundColor: 'var(--surface-alt)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={15} style={{ color: 'var(--success)' }} />
          <span>Authorized University Personnel & Student Access Only</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
