import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, FileText, User, Clock, CheckCircle } from 'lucide-react';
import { appointmentApi } from '../../api/appointmentApi';
import type { Appointment } from '../../types';
import styles from './Consultation.module.css';

const ConsultationList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTodayQueue = async () => {
    try {
      setLoading(true);
      const res = await appointmentApi.getTodayAppointments();
      setAppointments(res || []);
    } catch (err) {
      console.error('Failed to load consultation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayQueue();
  }, []);

  const checkedInQueue = appointments.filter(
    (a) => a.appointmentStatus === 'CHECKED_IN' || a.appointmentStatus === 'IN_CONSULTATION' || a.appointmentStatus === 'COMPLETED'
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Doctor Consultations Interface</h1>
          <p style={{ color: '#64748b' }}>Active patient queue, clinical documentation, and diagnosis</p>
        </div>
        <Link to="/appointments" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          View Full Appointment Queue
        </Link>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stethoscope color="#2563eb" size={20} /> Today's Clinical Consultation Queue
        </h2>

        {loading ? (
          <p>Loading consultation queue...</p>
        ) : checkedInQueue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
            <Stethoscope size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>No Active Patient Consultations</h3>
            <p style={{ marginTop: '0.5rem' }}>
              Check in scheduled patients from the <strong>Appointments</strong> queue to begin clinical consultations.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {checkedInQueue.map((apt) => (
              <div
                key={apt.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.05rem', color: '#0f172a' }}>
                    <User size={16} color="#475569" /> Patient: {apt.patientName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                    Doctor: Dr. {apt.doctorName} | Department: {apt.department || 'General'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> Time: {apt.appointmentTime} | Status: <strong style={{ textTransform: 'uppercase' }}>{apt.appointmentStatus}</strong>
                  </div>
                </div>

                <div>
                  {apt.appointmentStatus === 'COMPLETED' ? (
                    <span style={{ color: '#16a34a', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={16} /> Consultation Completed
                    </span>
                  ) : (
                    <button
                      className={styles.submitBtn}
                      onClick={() => navigate(`/consultations/new/${apt.id}`)}
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem' }}
                    >
                      <FileText size={16} style={{ marginRight: '6px' }} />
                      {apt.appointmentStatus === 'IN_CONSULTATION' ? 'Resume Consultation' : 'Start Consultation'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationList;
