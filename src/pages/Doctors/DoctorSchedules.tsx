import { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { Days, type DoctorSchedule, type Doctor } from '../../types';
import { Clock, Trash2, Edit2, Filter, X } from 'lucide-react';
import styles from './DoctorSchedules.module.css';

const DoctorSchedules = () => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter state
  const [filterDoctorId, setFilterDoctorId] = useState<string>('');
  const [filterDay, setFilterDay] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    doctorId: '',
    dayOfWeek: Days.MONDAY,
    startTime: '09:00',
    endTime: '17:00'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      if (filterDoctorId) filterParams.doctorId = filterDoctorId;
      if (filterDay) filterParams.day = filterDay;

      const [schedRes, docRes] = await Promise.all([
        doctorApi.getSchedules(filterParams),
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
  }, [filterDoctorId, filterDay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = async (id: string) => {
    try {
      const schedule = await doctorApi.getScheduleById(id);
      setEditingId(schedule.id);
      setFormData({
        doctorId: schedule.doctorId,
        dayOfWeek: schedule.day,
        startTime: typeof schedule.startTime === 'string' ? schedule.startTime.substring(0, 5) : '09:00',
        endTime: typeof schedule.endTime === 'string' ? schedule.endTime.substring(0, 5) : '17:00'
      });
    } catch (err) {
      alert('Failed to load schedule details for edit.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      doctorId: '',
      dayOfWeek: Days.MONDAY,
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !formData.doctorId) {
      alert('Please select a doctor');
      return;
    }
    const formattedStartTime = formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime;
    const formattedEndTime = formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime;

    try {
      if (editingId) {
        // PUT /doctor-schedules
        await doctorApi.updateSchedule({
          scheduleId: editingId,
          dayOfWeek: formData.dayOfWeek,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        });
        alert('Schedule updated successfully!');
      } else {
        // POST /doctor-schedules
        await doctorApi.createSchedule({
          doctorId: formData.doctorId,
          dayOfWeek: formData.dayOfWeek,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        });
        alert('Schedule created successfully!');
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this schedule entry?')) {
      try {
        await doctorApi.deleteSchedule(id);
        if (editingId === id) resetForm();
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete schedule');
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

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <Filter size={18} style={{ color: '#64748b' }} />
        <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#475569' }}>Filter Schedules:</span>
        <select
          className={styles.select}
          style={{ width: 'auto', flex: '1', maxWidth: '240px' }}
          value={filterDoctorId}
          onChange={(e) => setFilterDoctorId(e.target.value)}
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>Dr. {d.name}</option>
          ))}
        </select>

        <select
          className={styles.select}
          style={{ width: 'auto', flex: '1', maxWidth: '180px' }}
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
        >
          <option value="">All Days</option>
          {Object.values(Days).map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        {(filterDoctorId || filterDay) && (
          <button
            onClick={() => { setFilterDoctorId(''); setFilterDay(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</h2>
            {editingId && (
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.formGroup}>
            <div className={styles.field}>
              <label>Doctor *</label>
              <select
                name="doctorId"
                className={styles.select}
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={!!editingId}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Day of Week *</label>
              <select name="dayOfWeek" className={styles.select} value={formData.dayOfWeek} onChange={handleChange}>
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

            <button type="submit" className={styles.submitBtn}>
              {editingId ? 'Update Schedule' : 'Save Schedule'}
            </button>
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
                      {typeof s.startTime === 'string' ? s.startTime : `${(s.startTime as any)?.hour}:${(s.startTime as any)?.minute}`} - {typeof s.endTime === 'string' ? s.endTime : `${(s.endTime as any)?.hour}:${(s.endTime as any)?.minute}`}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(s.id)}
                          style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}
                          title="Edit Schedule"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                          title="Delete Schedule"
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
    </div>
  );
};

export default DoctorSchedules;
