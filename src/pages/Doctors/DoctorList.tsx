import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Phone, Mail, Stethoscope, DollarSign, Trash2, Edit2 } from 'lucide-react';
import { doctorApi } from '../../api/doctorApi';
import type { Doctor } from '../../types';
import styles from './DoctorList.module.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getDoctors(0, 100);
      setDoctors(res.content || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this doctor?')) {
      try {
        await doctorApi.deleteDoctor(id);
        fetchDoctors();
      } catch (err) {
        alert('Failed to delete doctor');
      }
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Doctors Management</h1>
          <p>Manage medical specialists, schedules, and departments</p>
        </div>
        <div className={styles.actionButtons}>
          <Link to="/doctors/schedules" className={styles.secondaryBtn}>
            <Calendar size={18} />
            <span>Manage Schedules</span>
          </Link>
          <Link to="/doctors/new" className={styles.primaryBtn}>
            <Plus size={18} />
            <span>Add Doctor</span>
          </Link>
        </div>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.searchGroup}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search doctor name, department, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading doctors...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className={styles.emptyState}>
          <Stethoscope size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No doctors found</h3>
          <p>Try adjusting your search or add a new doctor.</p>
        </div>
      ) : (
        <div className={styles.doctorsGrid}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id || doctor.email} className={styles.doctorCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {doctor.name?.[0] || 'D'}
                </div>
                <div className={styles.doctorMeta}>
                  <h3>Dr. {doctor.name}</h3>
                  <span className={styles.badge}>{doctor.specialization || doctor.department || 'General Physician'}</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <Mail size={16} />
                  <span>{doctor.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <Phone size={16} />
                  <span>{doctor.phoneNumber || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <Stethoscope size={16} />
                  <span>License: {doctor.licenseNumber || 'Verified'}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.fee}>
                  <DollarSign size={16} style={{ display: 'inline' }} />
                  {doctor.consultationFee ? `$${doctor.consultationFee}` : '$50'}
                </div>
                {doctor.id && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/doctors/${doctor.id}/edit`} className={styles.secondaryBtn} style={{ color: '#2563eb' }} title="Edit Doctor">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(doctor.id!)} className={styles.secondaryBtn} style={{ color: '#ef4444' }} title="Delete Doctor">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
