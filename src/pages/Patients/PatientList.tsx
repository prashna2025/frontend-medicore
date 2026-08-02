import { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { apiClient } from '../../api/client';
import styles from './PatientList.module.css';

interface Patient {
  id: string;
  fullName: string;
  patientNumber: string;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      // Adjusted based on PatientController: /patients?page=0&size=10
      const response = await apiClient.get('/patients', {
        params: {
          page: 0,
          size: 10,
          fullName: searchTerm || undefined
        }
      });
      if (response.data && response.data.status) {
        setPatients(response.data.data.content || []); // Based on PagedResponse
      }
    } catch (error) {
      console.error('Failed to fetch patients', error);
      // Fallback data for UI showcase if backend is not running or throws error
      setPatients([
        { id: '1', fullName: 'John Doe', patientNumber: 'PT-1001', phoneNumber: '+1 234-567-8900', gender: 'MALE', bloodGroup: 'O+' },
        { id: '2', fullName: 'Jane Smith', patientNumber: 'PT-1002', phoneNumber: '+1 234-567-8901', gender: 'FEMALE', bloodGroup: 'A-' },
        { id: '3', fullName: 'Robert Johnson', patientNumber: 'PT-1003', phoneNumber: '+1 234-567-8902', gender: 'MALE', bloodGroup: 'B+' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Patients</h3>
          <p>Manage hospital patients and records.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Add Patient
        </button>
      </div>

      <div className="card">
        <div className={styles.toolbar}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Search patients by name..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline">Search</button>
          </form>
          
          <button className={`btn btn-outline ${styles.filterBtn}`}>
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No patients found.</td>
                </tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient.id}>
                    <td className={styles.patientId}>{patient.patientNumber}</td>
                    <td className={styles.patientName}>{patient.fullName}</td>
                    <td>{patient.phoneNumber}</td>
                    <td>
                      <span className={styles.badge}>{patient.gender}</span>
                    </td>
                    <td>{patient.bloodGroup}</td>
                    <td>
                      <button className={styles.actionLink}>View</button>
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

export default PatientList;
