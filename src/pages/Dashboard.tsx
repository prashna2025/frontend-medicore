import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const stats = [
    { title: 'Total Patients', value: '1,248', icon: <Users size={24} />, trend: '+12%' },
    { title: 'Appointments Today', value: '42', icon: <Calendar size={24} />, trend: '+5%' },
    { title: 'Available Doctors', value: '18', icon: <Activity size={24} />, trend: 'Stable' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h3>Welcome back!</h3>
        <p>Here is what's happening at Medicore today.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card">
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <span className={styles.statTrend}>
                <TrendingUp size={16} />
                {stat.trend}
              </span>
            </div>
            <div className={styles.statBody}>
              <h4>{stat.title}</h4>
              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
