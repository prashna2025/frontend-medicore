import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { staffApi } from '../../api/staffApi';
import { Gender } from '../../types';
import styles from './Staff.module.css';

const StaffForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: Gender.MALE,
    role: 'RECEPTIONIST'
  });

  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        try {
          setLoading(true);
          const staff = await staffApi.getStaffById(id);
          setFormData({
            name: staff.name || '',
            email: staff.email || '',
            username: staff.username || '',
            password: '',
            phoneNumber: staff.phoneNumber || '',
            address: staff.address || '',
            gender: staff.gender || Gender.MALE
          });
        } catch (err) {
          console.error('Failed to load staff details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    }
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
        await staffApi.updateStaff({
          staffId: id,
          name: formData.name,
          address: formData.address,
          phoneNumber: formData.phoneNumber
        });
        alert('Staff details updated successfully!');
      } else {
        await staffApi.createStaff(formData);
        alert('Staff registered successfully!');
      }
      navigate('/staff');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save staff details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>{isEdit ? 'Edit Staff Member' : 'Add Hospital Staff Member'}</h1>
          <p style={{ color: '#64748b' }}>{isEdit ? 'Update staff personnel profile' : 'Register administrative and support staff accounts'}</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                required
                className={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {!isEdit && (
              <>
                <div className={styles.field}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className={styles.input}
                    placeholder="john.doe@medicore.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className={styles.input}
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Staff Role *</label>
                  <select name="role" className={styles.select} value={formData.role} onChange={handleChange} required>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="PATIENT">Patient</option>
                  </select>
                </div>

                <div className={styles.field}>
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
              </>
            )}

            <div className={styles.field}>
              <label>Phone Number *</label>
              <input
                type="text"
                name="phoneNumber"
                required
                className={styles.input}
                placeholder="+1 555-0199"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Gender</label>
              <select name="gender" className={styles.select} value={formData.gender} onChange={handleChange} disabled={isEdit}>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
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

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/staff" style={{ padding: '0.625rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', textDecoration: 'none', color: '#475569' }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Saving...' : isEdit ? 'Update Staff' : 'Register Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
