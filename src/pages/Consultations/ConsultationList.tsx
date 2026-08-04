import { Link } from 'react-router-dom';
import { Stethoscope, Plus } from 'lucide-react';
import styles from './Consultation.module.css';

const ConsultationList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Doctor Consultations</h1>
          <p style={{ color: '#64748b' }}>Manage active patient consultations and diagnostic histories</p>
        </div>
        <Link to="/appointments" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          <Plus size={18} style={{ marginRight: '6px' }} />
          Select Appointment to Consult
        </Link>
      </div>

      <div className={styles.card} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <Stethoscope size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h2>Consultations Interface Ready</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          To start a consultation, navigate to <strong>Appointments</strong> and click <strong>"Start Consultation"</strong> on any checked-in patient.
        </p>
      </div>
    </div>
  );
};

export default ConsultationList;
