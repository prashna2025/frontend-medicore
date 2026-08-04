import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { consultationApi } from '../../api/consultationApi';
import type { Consultation } from '../../types';
import { FileText, Plus, CheckCircle, Calendar, Activity } from 'lucide-react';
import styles from './Consultation.module.css';

const ConsultationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    consultationApi
      .getConsultationById(id)
      .then((res) => setConsultation(res))
      .catch((err) => console.error('Failed to load consultation:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    if (!id) return;
    try {
      await consultationApi.completeConsultation(id);
      alert('Consultation marked complete!');
      navigate('/appointments');
    } catch (err) {
      alert('Failed to complete consultation');
    }
  };

  if (loading) return <div className={styles.container}>Loading consultation details...</div>;
  if (!consultation) return <div className={styles.container}>Consultation record not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Consultation Summary</h1>
          <p style={{ color: '#64748b' }}>Consultation ID: {consultation.id}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/prescriptions/new/${consultation.id}`} className={styles.submitBtn} style={{ background: '#10b981', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <Plus size={18} style={{ marginRight: '6px' }} />
            Add Prescription
          </Link>
          <button onClick={handleComplete} className={styles.submitBtn} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <CheckCircle size={18} style={{ marginRight: '6px' }} />
            Mark Completed
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#2563eb" /> Reported Symptoms
            </h3>
            <p style={{ fontSize: '1.125rem', marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem' }}>
              {consultation.symptoms}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#10b981" /> Diagnosis
            </h3>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '0.5rem', background: '#f0fdf4', color: '#166534', padding: '0.75rem', borderRadius: '0.375rem' }}>
              {consultation.diagnosis}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: '#475569' }}>Clinical Notes</h3>
            <p style={{ fontSize: '0.9375rem', marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem' }}>
              {consultation.clinicalNotes || 'None specified.'}
            </p>
          </div>

          {consultation.followUpDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7' }}>
              <Calendar size={18} />
              <span>Recommended Follow-up Date: <strong>{consultation.followUpDate}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
