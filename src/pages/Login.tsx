import { useState } from 'react';
import { HeartPulse, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Adjusted the payload structure based on standard login requests, 
      // but you might need to adapt it according to the exact backend requirements.
      const response = await apiClient.post('/auth/login', {
        email, // or username depending on LoginRequest.java
        password
      });

      if (response.data && response.data.status) {
        const token = response.data.data.token; 
        const user = response.data.data.user || { id: '1', email, role: 'Admin', firstName: 'Admin' };
        login(user, token);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoWrapper}>
        <HeartPulse size={48} className={styles.logoIcon} />
        <h1>Medicore</h1>
        <p>Hospital Management System</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className="label" htmlFor="email">Email</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medicore.com"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className="label" htmlFor="password">Password</label>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary ${styles.submitBtn}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
