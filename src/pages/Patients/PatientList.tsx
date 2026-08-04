import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { Patient } from '../../types';
import styles from './PatientList.module.css';

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
      const res = await patientApi.getAllPatients(0, 50);
      setPatients(res.content || []);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      p.phoneNumber?.includes(searchTerm) ||
      p.patientNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Patients Registry</h3>
          <p>Manage hospital patients, medical histories, and personal details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/patients/new'}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Add Patient
        </button>
      </div>

      <div className="card">
        <div className={styles.toolbar}>
          <div className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Search patients by name, phone, or ID..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
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
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No patients found.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className={styles.patientId}>{patient.patientNumber || patient.id}</td>
                    <td className={styles.patientName}>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.phoneNumber}</td>
                    <td>
                      <span className={styles.badge}>{patient.gender}</span>
                    </td>
                    <td>{patient.bloodGroup || 'N/A'}</td>
                    <td>
                      <button className={styles.actionLink} onClick={() => window.location.href = `/patients/${patient.id}`}>View</button>
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
