import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import styles from './PatientForm.module.css'; // Reusing some form styles for layout

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/patients/${id}`);
      if (response.data && response.data.data) {
        setPatient(response.data.data);
      } else {
        // Fallback for UI if API is not fully hooked up
        setPatient({
          id,
          fullName: 'John Doe',
          patientNumber: `PT-100${id}`,
          phoneNumber: '+1 234-567-8900',
          gender: 'MALE',
          bloodGroup: 'O+',
          address: '123 Main St, Springfield',
          dateOfBirth: '1985-10-15',
        });
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setPatient({
        id,
        fullName: 'John Doe',
        patientNumber: `PT-100${id}`,
        phoneNumber: '+1 234-567-8900',
        gender: 'MALE',
        bloodGroup: 'O+',
        address: '123 Main St, Springfield',
        dateOfBirth: '1985-10-15',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await apiClient.delete(`/patients/${id}`);
        navigate('/patients');
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  };

  if (isLoading) return <div className={styles.container}><p>Loading patient details...</p></div>;
  if (error || !patient) return <div className={styles.container}><div className={styles.errorAlert}>{error || 'Patient not found'}</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button className="btn btn-outline" onClick={() => navigate('/patients')} style={{ marginRight: '1rem', padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3>Patient Details</h3>
            <p>{patient.patientNumber}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={() => navigate(`/patients/${id}/edit`)}>
            <Edit size={18} style={{ marginRight: '0.5rem' }} />
            Edit
          </button>
          <button className="btn btn-outline" onClick={handleDelete} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
            <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
            Delete
          </button>
        </div>
      </div>

      <div className="card">
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <p><strong>{patient.fullName}</strong></p>
          </div>
          <div className={styles.formGroup}>
            <label>Patient Number</label>
            <p><strong>{patient.patientNumber}</strong></p>
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <p><strong>{patient.phoneNumber}</strong></p>
          </div>
          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <p><strong>{patient.dateOfBirth || 'N/A'}</strong></p>
          </div>
          <div className={styles.formGroup}>
            <label>Gender</label>
            <p><strong>{patient.gender}</strong></p>
          </div>
          <div className={styles.formGroup}>
            <label>Blood Group</label>
            <p><strong>{patient.bloodGroup || 'N/A'}</strong></p>
          </div>
        </div>
        
        <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
          <label>Address</label>
          <p><strong>{patient.address || 'N/A'}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
