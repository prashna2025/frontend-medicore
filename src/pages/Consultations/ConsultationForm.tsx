import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { consultationApi } from '../../api/consultationApi';
import { CheckCircle } from 'lucide-react';
import styles from './Consultation.module.css';

const ConsultationForm = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    clinicalNotes: '',
    followUpDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;
    try {
      setLoading(true);
      const res = await consultationApi.startConsultation(appointmentId, formData);
      navigate(`/consultations/${res.id}`);
    } catch (err) {
      alert('Failed to save consultation details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Start Doctor Consultation</h1>
          <p style={{ color: '#64748b' }}>Record patient symptoms, diagnosis, and medical notes</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.field}>
            <label>Symptoms / Presenting Complaints *</label>
            <textarea
              name="symptoms"
              required
              className={styles.textarea}
              placeholder="e.g. Persistent cough for 3 days, mild fever, chest congestion..."
              value={formData.symptoms}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Diagnosis *</label>
            <textarea
              name="diagnosis"
              required
              className={styles.textarea}
              placeholder="e.g. Acute Bronchitis"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Clinical & Treatment Notes</label>
            <textarea
              name="clinicalNotes"
              className={styles.textarea}
              placeholder="e.g. Advised bed rest, hydration, nebulization twice daily..."
              value={formData.clinicalNotes}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Recommended Follow-Up Date</label>
            <input
              type="date"
              name="followUpDate"
              className={styles.input}
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              <CheckCircle size={18} style={{ display: 'inline', marginRight: '6px' }} />
              {loading ? 'Saving...' : 'Save & View Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;
