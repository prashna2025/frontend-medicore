import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescriptionApi';
import type { PrescriptionItem } from '../../types';
import { Plus, Trash2, Pill, CheckCircle } from 'lucide-react';
import styles from './Prescription.module.css';

const PrescriptionForm = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicineName: '', dosage: '500mg', frequency: 'Twice daily (1-0-1)', duration: '5 days', instructions: 'After meals' }
  ]);

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { medicineName: '', dosage: '1 tablet', frequency: 'Once daily (0-0-1)', duration: '7 days', instructions: '' }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationId) return;
    try {
      setLoading(true);
      const res = await prescriptionApi.createPrescription(consultationId, { items });
      navigate(`/prescriptions/${res.id}`);
    } catch (err) {
      alert('Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Create Medical Prescription</h1>
          <p style={{ color: '#64748b' }}>Consultation ID: {consultationId}</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pill color="#2563eb" size={20} /> Prescribed Medications
          </h2>

          {items.map((item, idx) => (
            <div key={idx} className={styles.itemRow}>
              <input
                type="text"
                className={styles.input}
                placeholder="Medicine Name (e.g. Amoxicillin)"
                value={item.medicineName}
                onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)}
                required
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Dosage (500mg)"
                value={item.dosage}
                onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                required
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Frequency (1-0-1)"
                value={item.frequency}
                onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                required
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Duration (5 days)"
                value={item.duration}
                onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                required
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Instructions (After meal)"
                value={item.instructions || ''}
                onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeItemRow(idx)}
                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button type="button" onClick={addItemRow} className={styles.addBtn}>
            <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Add Another Medicine
          </button>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              <CheckCircle size={18} style={{ display: 'inline', marginRight: '6px' }} />
              {loading ? 'Saving...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
