import { useState } from 'react';
import DarkVeil from './components/DarkVeil';
import GradientText from './components/GradientText';

const BACKEND_URL = 'https://url-shortener-backend-production-5721.up.railway.app';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const url = isLogin
        ? `${BACKEND_URL}/api/auth/login`
        : `${BACKEND_URL}/api/auth/register`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      onLogin(username, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgWrapper}>
        <DarkVeil
          hueShift={270}
          speed={1.2}
          warpAmount={0.5}
          noiseIntensity={0.05}
          scanlineIntensity={0.1}
          scanlineFrequency={100}
        />
      </div>
      <div style={styles.content}>
        <GradientText
          colors={['#ff6edf', '#00e5ff', '#bf5fff', '#ff6edf']}
          animationSpeed={6}
          direction="horizontal"
          pauseOnHover={true}
          className="title"
        >
          URL Shortener
        </GradientText>
        <div style={styles.card}>
          <h2 style={styles.title}>{isLogin ? '👋 Welcome Back' : '🚀 Create Account'}</h2>
          <p style={styles.subtitle}>{isLogin ? 'Login to manage your links' : 'Register to start shortening URLs'}</p>
          {error && <p style={styles.error}>{error}</p>}
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button style={styles.button} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
          <p style={styles.toggle}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span style={styles.link} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    background: '#0a0a0a',
    overflow: 'hidden',
  },
  bgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  card: {
    background: 'rgba(17, 17, 17, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #222',
    borderRadius: '1.5rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
  },
  subtitle: {
    color: '#aaa',
    fontSize: '13px',
    textAlign: 'center',
    margin: 0,
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(to right, #bf5fff, #ff6edf)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  error: { color: '#ff4444', fontSize: '13px', textAlign: 'center' },
  toggle: { color: '#aaa', fontSize: '13px', textAlign: 'center' },
  link: { color: '#bf5fff', cursor: 'pointer' },
};