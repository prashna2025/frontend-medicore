import { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { doctorApi } from '../../api/doctorApi';
import type { Department, Specialization, Doctor } from '../../types';
import { Plus, Trash2, Edit2, Building, Award, UserCheck, X } from 'lucide-react';
import styles from './DepartmentList.module.css';

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Department Form
  const [deptId, setDeptId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Specialization Form
  const [specName, setSpecName] = useState('');

  // HOD Modal/Form State
  const [selectedHodDept, setSelectedHodDept] = useState<Department | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  const fetchData = async () => {
    try {
      const dRes = await departmentApi.getDepartments(0, 100);
      setDepartments(Array.isArray(dRes) ? dRes : (dRes?.content || []));
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setDepartments([]);
    }

    try {
      const sRes = await departmentApi.getSpecializations();
      setSpecializations(Array.isArray(sRes) ? sRes : []);
    } catch (err) {
      console.error('Failed to fetch specializations:', err);
      setSpecializations([]);
    }

    try {
      const docRes = await doctorApi.getDoctors(0, 100);
      setDoctors(Array.isArray(docRes) ? docRes : (docRes?.content || []));
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrUpdateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;
    try {
      if (deptId) {
        // PUT /departments
        await departmentApi.updateDepartment({
          departmentId: deptId,
          name: deptName,
          description: deptDesc
        });
        alert('Department updated successfully');
      } else {
        // POST /departments
        await departmentApi.createDepartment({ name: deptName, description: deptDesc });
        alert('Department created successfully');
      }
      resetDeptForm();
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save department');
    }
  };

  const resetDeptForm = () => {
    setDeptId(null);
    setDeptName('');
    setDeptDesc('');
  };

  const handleEditDept = (dept: Department) => {
    setDeptId(dept.id);
    setDeptName(dept.name);
    setDeptDesc(dept.description || '');
  };

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName) return;
    try {
      await departmentApi.createSpecialization({ name: specName });
      setSpecName('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add specialization');
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (confirm('Delete department?')) {
      try {
        await departmentApi.deleteDepartment(id);
        if (deptId === id) resetDeptForm();
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  const handleDeleteSpec = async (id: string) => {
    if (confirm('Delete specialization?')) {
      try {
        await departmentApi.deleteSpecialization(id);
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete specialization');
      }
    }
  };

  const handleAssignOrReplaceHod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHodDept || !selectedDoctorId) return;
    try {
      // Try assigning HOD, if already assigned replace
      try {
        await departmentApi.assignHod(selectedHodDept.id, selectedDoctorId);
      } catch (err) {
        await departmentApi.replaceHod(selectedHodDept.id, selectedDoctorId);
      }
      alert('Head of Department updated!');
      setSelectedHodDept(null);
      setSelectedDoctorId('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update HOD');
    }
  };

  const handleRemoveHod = async (departmentId: string) => {
    if (confirm('Remove Head of Department assignment?')) {
      try {
        await departmentApi.removeHod(departmentId);
        alert('HOD removed');
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to remove HOD');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hospital Departments & Medical Specializations</h1>
        <p style={{ color: '#64748b' }}>Configure clinical units, specialist domains, and HOD assignments</p>
      </div>

      <div className={styles.grid}>
        {/* Department Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="#2563eb" />
              <h2>{deptId ? 'Edit Department' : 'Departments'}</h2>
            </div>
            {deptId && (
              <button onClick={resetDeptForm} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleAddOrUpdateDept} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              className={styles.input}
              placeholder="Department Name (e.g. Cardiology)"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              required
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Description / Wing location"
              value={deptDesc}
              onChange={(e) => setDeptDesc(e.target.value)}
            />
            <button type="submit" className={styles.addBtn}>
              <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} />
              {deptId ? 'Update Department' : 'Add Department'}
            </button>
          </form>

          <div className={styles.list}>
            {departments.map((d) => (
              <div key={d.id} className={styles.item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className={styles.itemTitle}>{d.name}</div>
                  {d.description && <div className={styles.itemDesc}>{d.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => setSelectedHodDept(d)}
                    style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Assign/Replace HOD"
                  >
                    <UserCheck size={14} /> HOD
                  </button>
                  <button onClick={() => handleEditDept(d)} className={styles.deleteBtn} style={{ color: '#2563eb' }} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteDept(d.id)} className={styles.deleteBtn} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialization Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#10b981" />
              <h2>Specializations</h2>
            </div>
          </div>

          <form onSubmit={handleAddSpec} className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Specialization Name (e.g. Pediatric Cardiology)"
              value={specName}
              onChange={(e) => setSpecName(e.target.value)}
              required
            />
            <button type="submit" className={styles.addBtn} style={{ background: '#10b981' }}>
              Add
            </button>
          </form>

          <div className={styles.list}>
            {specializations.map((s) => (
              <div key={s.id} className={styles.item}>
                <div className={styles.itemTitle}>{s.name}</div>
                <button onClick={() => handleDeleteSpec(s.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOD Assignment Dialog */}
      {selectedHodDept && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Set HOD for {selectedHodDept.name}</h3>
              <button onClick={() => setSelectedHodDept(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAssignOrReplaceHod}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Select Doctor for HOD *</label>
                <select
                  className={styles.input}
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => handleRemoveHod(selectedHodDept.id)} style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                  Remove Current HOD
                </button>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                  Save HOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
