import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import { Gender, BloodGroup } from '../../types';
import styles from './PatientForm.module.css';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    patientNumber: `PT-${Math.floor(100000 + Math.random() * 900000)}`,
    firstName: '',
    lastName: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: Gender.MALE,
    bloodGroup: BloodGroup.O_POSITIVE,
    address: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    allergies: '',
    medicalHistory: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      setIsLoading(true);
      const patient = await patientApi.getPatientById(id!);
      if (patient) {
        const nameParts = (patient.fullName || '').split(' ');
        setFormData({
          patientNumber: patient.patientNumber || `PT-${Math.floor(100000 + Math.random() * 900000)}`,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          fullName: patient.fullName || '',
          phoneNumber: patient.phoneNumber || '',
          email: patient.email || '',
          gender: patient.gender || Gender.MALE,
          bloodGroup: patient.bloodGroup || BloodGroup.O_POSITIVE,
          address: patient.address || '',
          dateOfBirth: formatDateToInput(patient.dateOfBirth || ''),
          emergencyContactName: patient.emergencyContactName || 'N/A',
          emergencyContactPhone: patient.emergencyContactPhone || patient.phoneNumber || 'N/A',
          emergencyContactRelation: patient.emergencyContactRelation || 'Family',
          allergies: patient.allergies || '',
          medicalHistory: patient.medicalHistory || ''
        });
      }
    } catch (err) {
      setError('Failed to load patient data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateToBackend = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const formatDateToInput = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const calculatedFullName = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      patientNumber: formData.patientNumber,
      fullName: calculatedFullName,
      address: formData.address || 'N/A',
      dateOfBirth: formatDateToBackend(formData.dateOfBirth),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      emergencyContactName: formData.emergencyContactName || 'N/A',
      emergencyContactPhone: formData.emergencyContactPhone || formData.phoneNumber || 'N/A',
      emergencyContactRelation: formData.emergencyContactRelation || 'Family',
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies
    };

    try {
      if (isEditMode && id) {
        await patientApi.updatePatient(id, payload);
      } else {
        await patientApi.createPatient(payload);
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
            <p>Enter patient profile details below.</p>
          </div>
        </div>
      </div>

      <div className="card">
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input 
                type="text" 
                name="firstName"
                className="input-field" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input 
                type="text" 
                name="lastName"
                className="input-field" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
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
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email"
                className="input-field" 
                value={formData.email} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Date of Birth *</label>
              <input 
                type="date" 
                name="dateOfBirth"
                className="input-field" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Gender *</label>
              <select 
                name="gender" 
                className="input-field" 
                value={formData.gender} 
                onChange={handleChange}
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Blood Group *</label>
              <select 
                name="bloodGroup" 
                className="input-field" 
                value={formData.bloodGroup} 
                onChange={handleChange}
              >
                {Object.entries(BloodGroup).map(([key, value]) => (
                  <option key={key} value={value}>{key.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Address *</label>
            <textarea 
              name="address"
              className="input-field" 
              value={formData.address} 
              onChange={handleChange} 
              rows={2}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Emergency Contact Name *</label>
              <input 
                type="text" 
                name="emergencyContactName"
                className="input-field" 
                placeholder="Contact person name"
                value={formData.emergencyContactName} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Emergency Contact Phone *</label>
              <input 
                type="text" 
                name="emergencyContactPhone"
                className="input-field" 
                placeholder="Contact phone number"
                value={formData.emergencyContactPhone} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Relation *</label>
              <input 
                type="text" 
                name="emergencyContactRelation"
                className="input-field" 
                placeholder="e.g. Spouse, Parent"
                value={formData.emergencyContactRelation} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Known Allergies</label>
              <input 
                type="text" 
                name="allergies"
                className="input-field" 
                placeholder="e.g. Penicillin, Peanuts"
                value={formData.allergies} 
                onChange={handleChange} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Medical History Notes</label>
              <input 
                type="text" 
                name="medicalHistory"
                className="input-field" 
                placeholder="e.g. Hypertension, Asthma"
                value={formData.medicalHistory} 
                onChange={handleChange} 
              />
            </div>
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
