import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingApi } from '../../api/billingApi';
import { patientApi } from '../../api/patientApi';
import type { Patient } from '../../types';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import styles from './Billing.module.css';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { description: 'Medical Consultation Fee', quantity: 1, unitPrice: 50 },
    { description: 'Diagnostic Test / Lab Charges', quantity: 1, unitPrice: 30 }
  ]);

  useEffect(() => {
    patientApi.getAllPatients().then((res) => setPatients(res.content || []));
  }, []);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Please select a patient');
      return;
    }
    try {
      setLoading(true);
      const res = await billingApi.createInvoice({
        patientId,
        items,
        discountAmount: Number(discountAmount),
        taxAmount: Number(taxAmount)
      });
      navigate(`/billing/${res.id}`);
    } catch (err) {
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const subTotal = calculateSubtotal();
  const grandTotal = subTotal - Number(discountAmount) + Number(taxAmount);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Generate Patient Invoice</h1>
          <p style={{ color: '#64748b' }}>Itemize services, consultations, and medical fees</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>
              Patient *
            </label>
            <select
              className={styles.select}
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.patientNumber || p.phoneNumber})
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Billable Items</h3>

          {items.map((item, idx) => (
            <div key={idx} className={styles.itemRow}>
              <input
                type="text"
                className={styles.input}
                placeholder="Item / Service description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                className={styles.input}
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className={styles.input}
                placeholder="Unit Price ($)"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                required
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button type="button" onClick={addItem} className={styles.input} style={{ background: '#f8fafc', cursor: 'pointer', marginTop: '0.5rem' }}>
            <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} /> Add Line Item
          </button>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', maxWidth: '350px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <strong>${subTotal.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>Discount ($):</span>
              <input
                type="number"
                min="0"
                className={styles.input}
                style={{ width: '100px', textAlign: 'right' }}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>Tax ($):</span>
              <input
                type="number"
                min="0"
                className={styles.input}
                style={{ width: '100px', textAlign: 'right' }}
                value={taxAmount}
                onChange={(e) => setTaxAmount(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, borderTop: '2px solid #0f172a', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#2563eb' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              <CheckCircle size={18} />
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
