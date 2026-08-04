import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Eye, FileText } from 'lucide-react';
import { billingApi } from '../../api/billingApi';
import { patientApi } from '../../api/patientApi';
import type { Invoice, Patient } from '../../types';
import styles from './Billing.module.css';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    patientApi.getAllPatients(0, 100).then((res) => {
      setPatients(res.content || []);
    });
  }, []);

  const handlePatientChange = async (pId: string) => {
    setSelectedPatientId(pId);
    if (!pId) {
      setInvoices([]);
      return;
    }
    try {
      setLoading(true);
      const res = await billingApi.getInvoicesByPatient(pId);
      setInvoices(res.content || []);
    } catch (err) {
      console.error('Failed to load patient invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Billing & Invoices</h1>
          <p style={{ color: '#64748b' }}>Manage patient invoices, payment status, and financial records</p>
        </div>
        <Link to="/billing/new" className={styles.primaryBtn}>
          <Plus size={18} />
          Create Invoice
        </Link>
      </div>

      <div className={styles.card}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem', color: '#475569' }}>
              Select Patient to View Invoices
            </label>
            <select
              className={styles.select}
              value={selectedPatientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.patientNumber || p.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedPatientId ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Billing Lookup</h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Select a patient above to view their issued invoices or generate a new patient invoice.
            </p>
            <Link to="/billing/new" className={styles.primaryBtn}>
              <Plus size={18} /> Generate New Patient Invoice
            </Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <FileText size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No invoices found for the selected patient.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td><strong>#{inv.invoiceNumber || inv.id.substring(0, 8)}</strong></td>
                  <td>${inv.subTotal || 0}</td>
                  <td>-${inv.discountAmount || 0}</td>
                  <td>+${inv.taxAmount || 0}</td>
                  <td><strong style={{ color: '#2563eb' }}>${inv.totalAmount || 0}</strong></td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${inv.status || 'PENDING'}`]}`}>
                      {inv.status || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/billing/${inv.id}`)}
                      className={styles.primaryBtn}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#2563eb' }}
                    >
                      <Eye size={14} style={{ marginRight: '4px' }} /> View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
