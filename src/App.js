import { useState } from 'react';
import DarkVeil from './components/DarkVeil';
import Magnet from './components/Magnet';
import GradientText from './components/GradientText';

const BACKEND_URL = 'url-shortener-backend-production-5721.up.railway.app';

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl.trim()) return;
    setLoading(true);
    setError('');
    setShortUrl('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });
      if (!response.ok) throw new Error('Failed to shorten URL');
      const data = await response.json();
      setShortUrl(`${BACKEND_URL}/${data.shortCode}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          yoyo={false}
          className="title"
        >
          URL Shortener
        </GradientText>
        <div style={styles.card}>
          <p style={styles.subtitle}>Paste your long URL and get a short one instantly</p>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="https://your-long-url.com"
              value={originalUrl}
              onChange={e => setOriginalUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleShorten()}
            />
            <Magnet>
              <button style={styles.button} onClick={handleShorten} disabled={loading}>
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
            </Magnet>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {shortUrl && (
            <div style={styles.resultBox}>
              <p style={styles.resultLabel}>Your shortened URL:</p>
              <div style={styles.resultRow}>
                <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.shortUrl}>
                  {shortUrl}
                </a>
                <button style={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✅ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
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
    width: '100%',
    maxWidth: '600px',
    background: 'rgba(17, 17, 17, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    border: '1px solid #222',
    padding: '2rem',
  },
  subtitle: {
    color: '#aaa',
    marginBottom: '1.5rem',
    fontSize: '14px',
    textAlign: 'center',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(to right, #bf5fff, #ff6edf)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  error: { color: '#ff4444', marginTop: '1rem', fontSize: '13px' },
  resultBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(26, 26, 26, 0.8)',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  resultLabel: { color: '#aaa', fontSize: '12px', marginBottom: '6px' },
  resultRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: '12px',
  },
  shortUrl: {
    color: '#00e5ff',
    fontSize: '16px',
    wordBreak: 'break-all',
    minWidth: 0,
  },
 copyBtn: {
    padding: '6px 14px',
    background: 'linear-gradient(to right, #bf5fff, #ff6edf)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
},
};