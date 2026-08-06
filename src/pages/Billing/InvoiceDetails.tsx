import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { billingApi } from '../../api/billingApi';
import { PaymentMethod, type Invoice } from '../../types';
import { CreditCard, Printer, CheckCircle } from 'lucide-react';
import styles from './Billing.module.css';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [transactionRef, setTransactionRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoice = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await billingApi.getInvoiceById(id);
      setInvoice(res);
      if (res) setPaymentAmount(res.balanceDue || res.totalAmount || 0);
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !paymentAmount) return;
    try {
      setSubmitting(true);
      await billingApi.recordPayment(id, {
        amountPaid: Number(paymentAmount),
        paymentMethod,
        transactionId: transactionRef
      });
      alert('Payment recorded successfully!');
      fetchInvoice();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading invoice details...</div>;
  if (!invoice) return <div className={styles.container}>Invoice not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Invoice #{invoice.invoiceNumber || invoice.id}</h1>
          <span className={`${styles.statusBadge} ${styles[`status${invoice.status || 'PENDING'}`]}`}>
            {invoice.status || 'PENDING'}
          </span>
        </div>
        <button onClick={() => window.print()} className={styles.primaryBtn} style={{ background: '#475569' }}>
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: '#64748b', fontSize: '0.875rem' }}>Invoice To</h3>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '0.25rem' }}>
              {(invoice as any).patientName || `Patient: ${invoice.patientId}`}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: '#64748b', fontSize: '0.875rem' }}>Date Issued</h3>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item / Service Description</th>
              <th>Unit (Qty)</th>
              <th>Unit Price ($)</th>
              <th>Total Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice}</td>
                <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span> <strong>${invoice.subTotal || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Discount:</span> <strong>-${invoice.discountAmount || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax:</span> <strong>+${invoice.taxAmount || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem' }}>
              <span>Total Amount:</span> <span style={{ color: '#2563eb' }}>${invoice.totalAmount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
              <span>Amount Paid:</span> <strong>${invoice.amountPaid || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: 600 }}>
              <span>Balance Due:</span> <strong>${invoice.balanceDue || 0}</strong>
            </div>
          </div>
        </div>

        {invoice.status !== 'PAID' && (
          <div style={{ marginTop: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="#2563eb" /> Record Payment
            </h3>

            <form onSubmit={handleRecordPayment} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Payment Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className={styles.input}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Payment Method</label>
                <select
                  className={styles.select}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  <option value={PaymentMethod.CASH}>Cash</option>
                  <option value={PaymentMethod.CARD}>Credit / Debit Card</option>
                  <option value={PaymentMethod.INSURANCE}>Health Insurance</option>
                  <option value={PaymentMethod.ONLINE}>Online Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Reference / Txn ID</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. TXN-89241"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                />
              </div>

              <button type="submit" disabled={submitting} className={styles.primaryBtn}>
                <CheckCircle size={16} /> {submitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
