import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescriptionApi';
import type { Prescription } from '../../types';
import { Printer, Pill, HeartPulse } from 'lucide-react';
import styles from './Prescription.module.css';

const PrescriptionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    prescriptionApi
      .getPrescriptionById(id)
      .then((res) => setPrescription(res))
      .catch((err) => console.error('Failed to load prescription:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.container}>Loading prescription...</div>;
  if (!prescription) return <div className={styles.container}>Prescription record not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Prescription Details</h1>
          <p style={{ color: '#64748b' }}>Rx Ref: {prescription.id}</p>
        </div>
        <button onClick={() => window.print()} className={styles.submitBtn} style={{ background: '#475569', display: 'inline-flex', alignItems: 'center' }}>
          <Printer size={18} style={{ marginRight: '6px' }} /> Print Rx
        </button>
      </div>

      <div className={styles.prescriptionCard}>
        <div className={styles.rxHeader}>
          <div>
            <div className={styles.rxLogo}>
              <HeartPulse style={{ display: 'inline', marginRight: '6px' }} /> Medicore Clinic
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Official Medical Prescription Document
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#475569' }}>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Consultation: {prescription.consultationId}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
          <Pill color="#2563eb" /> Prescribed Medications (Rx)
        </h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {prescription.items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td><strong>{item.medicineName}</strong></td>
                <td>{item.dosage}</td>
                <td>{item.frequency}</td>
                <td>{item.duration}</td>
                <td>{item.instructions || 'As advised'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionDetails;
