import { Link } from 'react-router-dom';
import { Plus, CreditCard } from 'lucide-react';
import styles from './Billing.module.css';

const InvoiceList = () => {
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
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>Billing Management Center</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Generate patient billing invoices or look up records by clicking below.
          </p>
          <Link to="/billing/new" className={styles.primaryBtn}>
            <Plus size={18} /> Generate New Patient Invoice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
