import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.card}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
