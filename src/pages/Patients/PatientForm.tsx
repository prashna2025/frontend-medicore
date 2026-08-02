import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { apiClient } from '../../api/client';
import styles from './PatientForm.module.css';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: 'MALE',
    bloodGroup: 'O+',
    address: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/patients/${id}`);
      if (response.data && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load patient data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await apiClient.put(`/patients/${id}`, formData);
      } else {
        await apiClient.post('/patients', formData);
      }
      navigate('/patients');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save patient');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button className="btn btn-outline" onClick={() => navigate('/patients')} style={{ marginRight: '1rem', padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h3>
            <p>Enter patient details below.</p>
          </div>
        </div>
      </div>

      <div className="card">
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              className="input-field" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Phone Number *</label>
              <input 
                type="text" 
                name="phoneNumber"
                className="input-field" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="dateOfBirth"
                className="input-field" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Gender *</label>
              <select 
                name="gender" 
                className="input-field" 
                value={formData.gender} 
                onChange={handleChange}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Blood Group</label>
              <select 
                name="bloodGroup" 
                className="input-field" 
                value={formData.bloodGroup} 
                onChange={handleChange}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <textarea 
              name="address"
              className="input-field" 
              value={formData.address} 
              onChange={handleChange} 
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/patients')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {isLoading ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
