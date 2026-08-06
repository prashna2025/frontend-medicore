import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, Edit } from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { Patient } from '../../types';
import toast from 'react-hot-toast';
import styles from './PatientList.module.css';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await patientApi.getAllPatients(0, 50, undefined, searchTerm || undefined);
      setPatients(res.content || []);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete patient "${name}"?`)) {
      try {
        await patientApi.deletePatient(id);
        toast.success('Patient deleted successfully');
        fetchPatients();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Patients Registry</h3>
          <p>Manage hospital patients, medical histories, and personal details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/patients/new')}>
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
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No patients found.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className={styles.patientId}>{patient.patientNumber || patient.id}</td>
                    <td className={styles.patientName}>{patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'N/A'}</td>
                    <td>{patient.phoneNumber}</td>
                    <td>
                      <span className={styles.badge}>{patient.gender}</span>
                    </td>
                    <td>{patient.bloodGroup ? patient.bloodGroup.replace('_', ' ') : 'N/A'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" onClick={() => navigate(`/patients/${patient.id}`)} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-slate-600 hover:bg-slate-50 rounded" onClick={() => navigate(`/patients/${patient.id}/edit`)} title="Edit Patient">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(patient.id!, patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`)} title="Delete Patient">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
