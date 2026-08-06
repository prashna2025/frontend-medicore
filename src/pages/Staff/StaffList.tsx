import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { staffApi } from '../../api/staffApi';
import type { Staff } from '../../types';
import { Plus, UserCheck, Trash2, Mail, Phone, Edit2 } from 'lucide-react';
import styles from './Staff.module.css';

const StaffList = () => {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getStaffs();
      setStaffMembers(res.content || []);
    } catch (err) {
      console.error('Failed to load staff list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      try {
        await staffApi.deleteStaff(id);
        fetchStaff();
      } catch (err) {
        alert('Failed to delete staff member');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Staff Management</h1>
          <p style={{ color: '#64748b' }}>Manage hospital administrative, nursing, and support personnel</p>
        </div>
        <Link to="/staff/new" className={styles.primaryBtn}>
          <Plus size={18} /> Add Staff Member
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading staff personnel...</p>
        ) : staffMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
            <UserCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No staff members registered yet.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Username</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className={styles.avatar}>{staff.name?.[0] || 'S'}</div>
                    <div>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{staff.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{staff.email}</span>
                    </div>
                  </td>
                  <td>@{staff.username}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8125rem', color: '#475569' }}>
                      <span><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{staff.email}</span>
                      <span><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{staff.phoneNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{staff.gender || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/staff/${staff.id}/edit`} style={{ color: '#2563eb' }} title="Edit Staff">
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(staff.id)}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Staff"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default StaffList;
