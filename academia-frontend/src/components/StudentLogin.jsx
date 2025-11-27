import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // NORMAL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      const { token, studentId } = response.data;
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('loggedStudentId', studentId);
      navigate('/dashboard');

    } catch (err) {
      setError('Login Failed. Check credentials.');
      console.error(err);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const response = await axios.post('http://localhost:8080/api/auth/google', {
        token: googleToken
      });
      const { token, studentId } = response.data;
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('loggedStudentId', studentId);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Login Backend Error:", err);
      setError("Google Login Failed. Ensure email is registered.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to Academia ERP</p>
        </div>

        {/* Error Message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginButton}>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.line}></div>
          <span style={styles.orText}>OR</span>
          <div style={styles.line}></div>
        </div>

        {/* GOOGLE LOGIN */}
        <div style={styles.googleContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
//             theme="filled_black"
            shape="pill"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
// --- CREAM / WARM AESTHETIC STYLES ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Soft Cream Gradient
    background: 'linear-gradient(135deg, #fdfbf7 0%, #5a2720 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '45px',
    borderRadius: '16px',
    // Softer, warmer shadow
    boxShadow: '0 10px 30px rgba(92, 85, 75, 0.1)',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
    border: '1px solid #f0efe9', // Subtle border
  },
  header: {
    marginBottom: '35px',
  },
  title: {
    margin: '0',
    color: '#4a4036', // Dark Coffee Brown
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '10px 0 0',
    color: '#8c857b', // Muted Taupe
    fontSize: '15px',
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '25px',
    border: '1px solid #fc8181',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#5c554b', // Warm Gray/Brown
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    backgroundColor: '#faf9f6', // Off-white input bg
    border: '1px solid #e2e0d6',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#4a4036',
    transition: 'all 0.2s',
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    // Deep Earthy Brown (High Contrast)
    backgroundColor: '#5d4037',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 12px rgba(93, 64, 55, 0.2)',
    transition: 'transform 0.1s',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
  },
  line: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e0d6',
  },
  orText: {
    padding: '0 12px',
    color: '#a8a29e',
    fontSize: '12px',
    fontWeight: '600',
  },
  googleContainer: {
    display: 'flex',
    justifyContent: 'center',
  }
};

export default StudentLogin;
