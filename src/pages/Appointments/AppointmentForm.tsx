import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { appointmentApi } from '../../api/appointmentApi';
import { patientApi } from '../../api/patientApi';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import type { Patient, Doctor, Department } from '../../types';
import styles from '../Patients/PatientForm.module.css';

const AppointmentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00',
    reason: ''
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [patRes, docRes, deptRes] = await Promise.all([
          patientApi.getAllPatients(0, 100),
          doctorApi.getDoctors(0, 100),
          departmentApi.getDepartments(0, 100)
        ]);
        setPatients(patRes.content || []);
        setDoctors(docRes.content || []);
        setDepartments(deptRes.content || []);
      } catch (err) {
        console.error('Failed to load form options', err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.departmentId) {
      setError('Please select patient, doctor, and department');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await appointmentApi.createAppointment({
        ...formData,
        appointmentTime: `${formData.appointmentTime}:00`
      });
      navigate('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button className="btn btn-outline" onClick={() => navigate('/appointments')} style={{ marginRight: '1rem', padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3>Schedule Appointment</h3>
            <p>Book a new clinical consultation for a registered patient.</p>
          </div>
        </div>
      </div>

      <div className="card">
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Patient *</label>
              <select 
                name="patientId" 
                className="input-field" 
                value={formData.patientId} 
                onChange={handleChange}
                required
              >
                <option value="">Select Registered Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.phoneNumber})</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Department *</label>
              <select 
                name="departmentId" 
                className="input-field" 
                value={formData.departmentId} 
                onChange={handleChange}
                required
              >
                <option value="">Select Clinical Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Assigned Doctor *</label>
              <select 
                name="doctorId" 
                className="input-field" 
                value={formData.doctorId} 
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor Specialist</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization || d.department || 'General'})</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Appointment Date *</label>
              <input 
                type="date" 
                name="appointmentDate"
                className="input-field" 
                value={formData.appointmentDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Appointment Time *</label>
              <input 
                type="time" 
                name="appointmentTime"
                className="input-field" 
                value={formData.appointmentTime} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Reason for Visit</label>
            <textarea 
              name="reason"
              className="input-field" 
              value={formData.reason} 
              onChange={handleChange} 
              rows={3}
              placeholder="e.g. Routine checkup, Follow-up consultation..."
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/appointments')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
