import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import { Gender, type Department, type Specialization } from '../../types';
import styles from './DoctorForm.module.css';

const DoctorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: Gender.MALE,
    consultationFee: 50,
    licenseNumber: '',
    departmentId: '',
    specializationId: ''
  });

  useEffect(() => {
    const loadMetadataAndDoctor = async () => {
      try {
        setLoading(true);
        const [deptRes, specRes] = await Promise.all([
          departmentApi.getDepartments(),
          departmentApi.getSpecializations()
        ]);
        setDepartments(deptRes.content || []);
        setSpecializations(specRes || []);

        if (id) {
          const doctor = await doctorApi.getDoctorById(id);
          setFormData({
            name: doctor.name || '',
            email: doctor.email || '',
            username: doctor.username || '',
            password: '',
            phoneNumber: doctor.phoneNumber || '',
            address: doctor.address || '',
            gender: doctor.gender || Gender.MALE,
            consultationFee: doctor.consultationFee || 50,
            licenseNumber: doctor.licenseNumber || '',
            departmentId: '',
            specializationId: ''
          });
        }
      } catch (err) {
        console.error('Failed to load doctor form metadata:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMetadataAndDoctor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit && id) {
        await doctorApi.updateDoctor({
          id,
          doctorId: id,
          name: formData.name,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          consultationFee: Number(formData.consultationFee),
          departmentId: formData.departmentId || undefined,
          specializationId: formData.specializationId || undefined
        });
        alert('Doctor details updated successfully!');
      } else {
        await doctorApi.createDoctor({
          ...formData,
          consultationFee: Number(formData.consultationFee)
        });
        alert('Doctor registered successfully!');
      }
      navigate('/doctors');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save doctor details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.titleGroup}>
        <h1>{isEdit ? 'Edit Doctor Profile' : 'Register New Doctor'}</h1>
        <p>{isEdit ? 'Update doctor details and department assignment.' : 'Enter medical professional credentials and department assignment.'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className={styles.input}
              placeholder="Dr. Sarah Jenkins"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {!isEdit && (
            <>
              <div className={styles.fieldGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={styles.input}
                  placeholder="sarah.jenkins@medicore.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  required
                  className={styles.input}
                  placeholder="sjenkins"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  className={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  required
                  className={styles.input}
                  placeholder="MD-89241"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className={styles.fieldGroup}>
            <label>Phone Number *</label>
            <input
              type="text"
              name="phoneNumber"
              required
              className={styles.input}
              placeholder="+1 555-0192"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Gender</label>
            <select name="gender" className={styles.select} value={formData.gender} onChange={handleChange} disabled={isEdit}>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Consultation Fee ($) *</label>
            <input
              type="number"
              name="consultationFee"
              required
              min="0"
              className={styles.input}
              value={formData.consultationFee}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Department</label>
            <select name="departmentId" className={styles.select} value={formData.departmentId} onChange={handleChange}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Specialization</label>
            <select name="specializationId" className={styles.select} value={formData.specializationId} onChange={handleChange}>
              <option value="">Select Specialization</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Residential Address</label>
            <input
              type="text"
              name="address"
              className={styles.input}
              placeholder="123 Health Ave, Suite 400"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/doctors" className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Register Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
