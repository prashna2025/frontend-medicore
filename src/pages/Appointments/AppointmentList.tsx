import { useState, useEffect } from 'react';
import { Search, Plus, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { appointmentApi } from '../../api/appointmentApi';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../../types';
import styles from './AppointmentList.module.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await appointmentApi.getTodayAppointments();
      setAppointments(res || []);
    } catch (error) {
      console.error('Failed to fetch today appointments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      await appointmentApi.checkInAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert('Failed to check in appointment');
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await appointmentApi.cancelAppointment(id);
        fetchAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  const filtered = appointments.filter(
    (a) =>
      a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Today's Appointments Queue</h3>
          <p>Schedule patient check-ins, cancellations, and start consultations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/appointments/new')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          New Appointment
        </button>
      </div>

      <div className="card">
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search patient, doctor or department..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>Loading appointments...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No appointments found for today.</td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id}>
                    <td className={styles.patientName}>
                      <User size={16} style={{ marginRight: '0.5rem', color: '#64748b' }} />
                      {apt.patientName}
                    </td>
                    <td>Dr. {apt.doctorName}</td>
                    <td>{apt.department || 'General'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <Clock size={14} style={{ marginRight: '0.25rem' }} /> {apt.appointmentTime}
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge}>{apt.appointmentStatus}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {apt.appointmentStatus === 'SCHEDULED' && (
                          <>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#16a34a' }}
                              onClick={() => handleCheckIn(apt.id)}
                            >
                              <CheckCircle size={14} style={{ marginRight: '4px' }} /> Check In
                            </button>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#dc2626' }}
                              onClick={() => handleCancel(apt.id)}
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}

                        {(apt.appointmentStatus === 'CHECKED_IN' || apt.appointmentStatus === 'IN_CONSULTATION') && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
                            onClick={() => navigate(`/consultations/new/${apt.id}`)}
                          >
                            <FileText size={14} style={{ marginRight: '4px' }} /> Consult
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
