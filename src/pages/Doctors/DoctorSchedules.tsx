import { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { Days, type DoctorSchedule, type Doctor } from '../../types';
import { Clock, Trash2 } from 'lucide-react';
import styles from './DoctorSchedules.module.css';

const DoctorSchedules = () => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    doctorId: '',
    day: Days.MONDAY,
    startTime: '09:00',
    endTime: '17:00'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, docRes] = await Promise.all([
        doctorApi.getSchedules(),
        doctorApi.getDoctors()
      ]);
      setSchedules(schedRes.content || []);
      setDoctors(docRes.content || []);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) {
      alert('Please select a doctor');
      return;
    }
    try {
      await doctorApi.createSchedule({
        ...formData,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`
      });
      fetchData();
    } catch (err) {
      alert('Failed to add schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this schedule entry?')) {
      try {
        await doctorApi.deleteSchedule(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete schedule');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Doctor Schedules</h1>
          <p>Define operating hours and daily shift schedules for doctors</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Add New Schedule</h2>
          <form onSubmit={handleSubmit} className={styles.formGroup}>
            <div className={styles.field}>
              <label>Doctor *</label>
              <select name="doctorId" className={styles.select} value={formData.doctorId} onChange={handleChange} required>
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Day of Week *</label>
              <select name="day" className={styles.select} value={formData.day} onChange={handleChange}>
                {Object.values(Days).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Start Time *</label>
              <input type="time" name="startTime" className={styles.input} value={formData.startTime} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
              <label>End Time *</label>
              <input type="time" name="endTime" className={styles.input} value={formData.endTime} onChange={handleChange} required />
            </div>

            <button type="submit" className={styles.submitBtn}>Save Schedule</button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Active Shift Schedules</h2>
          {loading ? (
            <p>Loading schedule details...</p>
          ) : schedules.length === 0 ? (
            <p style={{ color: '#64748b' }}>No schedule configurations set yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Day</th>
                  <th>Working Hours</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>Dr. {s.doctorName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.department || 'General'}</div>
                    </td>
                    <td><span className={styles.dayBadge}>{s.day}</span></td>
                    <td>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {s.startTime} - {s.endTime}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(s.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedules;
