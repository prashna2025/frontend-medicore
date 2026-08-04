import { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import type { Department, Specialization } from '../../types';
import { Plus, Trash2, Building, Award } from 'lucide-react';
import styles from './DepartmentList.module.css';

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [specName, setSpecName] = useState('');

  const fetchData = async () => {
    try {
      const [dRes, sRes] = await Promise.all([
        departmentApi.getDepartments(),
        departmentApi.getSpecializations()
      ]);
      setDepartments(dRes.content || []);
      setSpecializations(sRes || []);
    } catch (err) {
      console.error('Failed to fetch departments/specializations:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;
    try {
      await departmentApi.createDepartment({ name: deptName, description: deptDesc });
      setDeptName('');
      setDeptDesc('');
      fetchData();
    } catch (err) {
      alert('Failed to add department');
    }
  };

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName) return;
    try {
      await departmentApi.createSpecialization({ name: specName });
      setSpecName('');
      fetchData();
    } catch (err) {
      alert('Failed to add specialization');
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (confirm('Delete department?')) {
      try {
        await departmentApi.deleteDepartment(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete department');
      }
    }
  };

  const handleDeleteSpec = async (id: string) => {
    if (confirm('Delete specialization?')) {
      try {
        await departmentApi.deleteSpecialization(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete specialization');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hospital Departments & Medical Specializations</h1>
        <p style={{ color: '#64748b' }}>Configure clinical units and specialist domains</p>
      </div>

      <div className={styles.grid}>
        {/* Department Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="#2563eb" />
              <h2>Departments</h2>
            </div>
          </div>

          <form onSubmit={handleAddDept} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
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
              Add Department
            </button>
          </form>

          <div className={styles.list}>
            {departments.map((d) => (
              <div key={d.id} className={styles.item}>
                <div>
                  <div className={styles.itemTitle}>{d.name}</div>
                  {d.description && <div className={styles.itemDesc}>{d.description}</div>}
                </div>
                <button onClick={() => handleDeleteDept(d.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
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
    </div>
  );
};

export default DepartmentList;
