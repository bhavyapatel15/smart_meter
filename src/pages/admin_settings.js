import AdminSidebar from '../components/admin_sidebar';
import AdminTopbar from '../components/admin_topbar';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminSettings() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/admin_info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.email);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };

    fetchAdminData();
  }, []);

 const handlePasswordChange = async (e) => {
  e.preventDefault();
  setMessage('');

  if (newPassword === currentPassword) {
    setMessage('❌ New password must be different from current password');
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage('❌ New password and confirmation do not match');
    return;
  }

  try {
    await axios.put(
      'http://localhost:5000/api/admin/change-password',
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage('✅ Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    setMessage(err.response?.data?.message || '❌ Error updating password');
  }
};

  return (
  <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
    <AdminSidebar />
    <div className="flex-grow-1 d-flex flex-column">
      <AdminTopbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="p-4 w-100" style={{ maxWidth: '500px' }}>
          <h2 className="mb-4 text-center">Admin Settings</h2>

          {message && (
            <div className={`alert text-center ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label text-light">Admin Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              value={email}
              readOnly
            />
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label className="form-label text-light">Current Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light">New Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light">Confirm New Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

}

export default AdminSettings;
