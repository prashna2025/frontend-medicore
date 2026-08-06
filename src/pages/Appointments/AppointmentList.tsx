import { useState, useEffect } from 'react';
import { Search, Plus, Clock, User, CheckCircle, Trash2, FileText, Calendar, Edit, X } from 'lucide-react';
import { appointmentApi } from '../../api/appointmentApi';
import { useNavigate } from 'react-router-dom';
import type { Appointment, AppointmentStatus } from '../../types';
import toast from 'react-hot-toast';
import styles from './AppointmentList.module.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'date'>('all');

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const navigate = useNavigate();

  const normalizeAppointmentStatus = (status?: string): AppointmentStatus => {
    switch (status?.toUpperCase()) {
      case 'BOOKED':
      case 'SCHEDULED':
        return 'SCHEDULED';
      case 'CHECKED_IN':
        return 'CHECKED_IN';
      case 'CONSULTING':
      case 'IN_CONSULTATION':
        return 'IN_CONSULTATION';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'NO_SHOW':
        return 'NO_SHOW';
      default:
        return 'SCHEDULED';
    }
  };

  const normalizeAppointments = (items: Appointment[] = []): Appointment[] =>
    items.map((apt) => ({
      ...apt,
      appointmentStatus: normalizeAppointmentStatus(apt.appointmentStatus),
      appointmentDate: apt.appointmentDate || selectedDate,
      appointmentTime: apt.appointmentTime || '00:00'
    }));

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, viewMode]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      let res: Appointment[];
      if (viewMode === 'today') {
        res = await appointmentApi.getTodayAppointments();
      } else if (viewMode === 'date') {
        res = await appointmentApi.getAppointmentsByDate(selectedDate);
      } else {
        res = await appointmentApi.getAllAppointments();
      }
      setAppointments(normalizeAppointments(res || []));
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      await appointmentApi.checkInAppointment(id);
      toast.success('Patient checked in successfully');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to check in appointment');
    }
  };

  const handleCancel = async (id: string, patientName: string) => {
    if (window.confirm(`Are you sure you want to cancel/delete appointment for "${patientName}"?`)) {
      try {
        await appointmentApi.cancelAppointment(id);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  const openRescheduleModal = (apt: Appointment) => {
    setRescheduleApt(apt);
    setNewDate(apt.appointmentDate || selectedDate);
    setNewTime(apt.appointmentTime ? apt.appointmentTime.substring(0, 5) : '10:00');
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newTime) return;

    const formattedTime = newTime.length === 5 ? `${newTime}:00` : newTime;
    try {
      await appointmentApi.rescheduleAppointment(rescheduleApt.id, {
        appointmentDate: newDate,
        appointmentTime: formattedTime
      });
      toast.success('Appointment rescheduled successfully');
      setRescheduleApt(null);
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reschedule appointment');
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
          <h3>Appointments Queue</h3>
          <p>Schedule patient check-ins, updates/rescheduling, cancellations, and start consultations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/appointments/new')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          New Appointment
        </button>
      </div>

      <div className="card">
        <div className={styles.toolbar} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.searchWrapper} style={{ flex: '1', minWidth: '240px' }}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search patient, doctor or department..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('all')}
              className={viewMode === 'all' ? "btn btn-primary" : "btn btn-outline"}
              style={{ fontSize: '0.85rem' }}
            >
              All Appointments
            </button>
            <button
              onClick={() => setViewMode('today')}
              className={viewMode === 'today' ? "btn btn-primary" : "btn btn-outline"}
              style={{ fontSize: '0.85rem' }}
            >
              Today's Queue
            </button>
            <button
              onClick={() => setViewMode('date')}
              className={viewMode === 'date' ? "btn btn-primary" : "btn btn-outline"}
              style={{ fontSize: '0.85rem' }}
            >
              Filter by Date
            </button>
            {viewMode === 'date' && (
              <input
                type="date"
                className="input-field"
                style={{ width: 'auto' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
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
                  <td colSpan={6} className={styles.emptyState}>No appointments found.</td>
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
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                        <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />{apt.appointmentDate || selectedDate}</span>
                        <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{apt.appointmentTime}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge}>{apt.appointmentStatus}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {apt.appointmentStatus === 'SCHEDULED' && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#16a34a', display: 'flex', alignItems: 'center' }}
                            onClick={() => handleCheckIn(apt.id)}
                            title="Check In Patient"
                          >
                            <CheckCircle size={14} style={{ marginRight: '4px' }} /> Check In
                          </button>
                        )}

                        {(apt.appointmentStatus === 'SCHEDULED' || apt.appointmentStatus === 'CHECKED_IN' || apt.appointmentStatus === 'IN_CONSULTATION') && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}
                            onClick={async () => {
                              if (apt.appointmentStatus === 'SCHEDULED') {
                                try { await appointmentApi.checkInAppointment(apt.id); } catch {}
                              }
                              navigate(`/consultations/new/${apt.id}`);
                            }}
                            title="Start Consultation"
                          >
                            <FileText size={14} style={{ marginRight: '4px' }} /> Consult
                          </button>
                        )}

                        {/* Update / Reschedule Icon Button */}
                        {apt.appointmentStatus !== 'CANCELLED' && apt.appointmentStatus !== 'COMPLETED' && (
                          <button
                            onClick={() => openRescheduleModal(apt)}
                            style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Update / Reschedule Appointment"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {/* Delete / Cancel Icon Button */}
                        {apt.appointmentStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(apt.id, apt.patientName)}
                            style={{ border: 'none', background: '#fef2f2', color: '#ef4444', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Cancel / Delete Appointment"
                          >
                            <Trash2 size={16} />
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

      {/* Reschedule / Update Modal */}
      {rescheduleApt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Reschedule Appointment</h3>
              <button onClick={() => setRescheduleApt(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
              Patient: <strong>{rescheduleApt.patientName}</strong> | Doctor: <strong>Dr. {rescheduleApt.doctorName}</strong>
            </p>
            <form onSubmit={handleRescheduleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: '#475569' }}>New Appointment Date *</label>
                <input
                  type="date"
                  className="input-field"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: '#475569' }}>New Appointment Time *</label>
                <input
                  type="time"
                  className="input-field"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setRescheduleApt(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
