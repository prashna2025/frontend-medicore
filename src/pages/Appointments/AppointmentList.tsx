import { useState, useEffect } from 'react';
import { Search, Plus, Calendar as CalendarIcon, Clock, User, X } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import styles from './AppointmentList.module.css';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  reason: string;
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/appointments');
      if (response.data && response.data.data) {
        setAppointments(response.data.data.content || response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      // Fallback data
      setAppointments([
        { id: '1', patientName: 'John Doe', doctorName: 'Dr. Smith', appointmentDate: '2026-08-05', appointmentTime: '10:00 AM', status: 'SCHEDULED', reason: 'General Checkup' },
        { id: '2', patientName: 'Jane Smith', doctorName: 'Dr. Johnson', appointmentDate: '2026-08-05', appointmentTime: '11:30 AM', status: 'SCHEDULED', reason: 'Follow-up' },
        { id: '3', patientName: 'Robert Johnson', doctorName: 'Dr. Davis', appointmentDate: '2026-08-04', appointmentTime: '09:00 AM', status: 'COMPLETED', reason: 'Blood Test' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return styles.badgeScheduled;
      case 'COMPLETED': return styles.badgeCompleted;
      case 'CANCELLED': return styles.badgeCancelled;
      default: return styles.badgeDefault;
    }
  };

  const cancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await apiClient.patch(`/appointments/${id}/cancel`);
        fetchAppointments(); // refresh
      } catch (err) {
        console.error(err);
        alert('Failed to cancel appointment');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Appointments</h3>
          <p>Schedule and manage patient appointments.</p>
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
              placeholder="Search appointments..."
              className="input-field"
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No appointments found.</td>
                </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id}>
                    <td className={styles.patientName}>
                      <User size={16} style={{marginRight: '0.5rem', color: 'var(--text-secondary)'}} />
                      {apt.patientName}
                    </td>
                    <td>{apt.doctorName}</td>
                    <td>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        <span style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem'}}>
                          <CalendarIcon size={14} style={{marginRight: '0.25rem'}} /> {apt.appointmentDate}
                        </span>
                        <span style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                          <Clock size={14} style={{marginRight: '0.25rem'}} /> {apt.appointmentTime}
                        </span>
                      </div>
                    </td>
                    <td>{apt.reason}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(apt.status)}`}>{apt.status}</span>
                    </td>
                    <td>
                      {apt.status === 'SCHEDULED' && (
                         <button className={styles.actionBtnCancel} onClick={() => cancelAppointment(apt.id)} title="Cancel Appointment">
                           <X size={18} />
                         </button>
                      )}
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
