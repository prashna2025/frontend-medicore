import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { apiClient } from '../../api/client';
import styles from '../Patients/PatientForm.module.css'; // Reusing form styles

const AppointmentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]); // Assuming a doctors endpoint or list
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch patients and doctors for dropdowns
    const fetchOptions = async () => {
      try {
        const patientsRes = await apiClient.get('/patients?size=100');
        if (patientsRes.data && patientsRes.data.data) {
          setPatients(patientsRes.data.data.content || patientsRes.data.data);
        }
        
        // Mocking doctors since we don't have a clear endpoint yet
        setDoctors([
          { id: 'd1', fullName: 'Dr. Smith' },
          { id: 'd2', fullName: 'Dr. Johnson' },
          { id: 'd3', fullName: 'Dr. Davis' },
        ]);
      } catch (err) {
        console.error('Failed to load options', err);
        // Fallback for UI testing
        setPatients([
          { id: '1', fullName: 'John Doe' },
          { id: '2', fullName: 'Jane Smith' },
        ]);
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
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/appointments', formData);
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
            <p>Book a new appointment for a patient.</p>
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
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Doctor *</label>
              <select 
                name="doctorId" 
                className="input-field" 
                value={formData.doctorId} 
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Date *</label>
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
              <label>Time *</label>
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
              placeholder="e.g., General checkup, Follow-up..."
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/appointments')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {isLoading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
