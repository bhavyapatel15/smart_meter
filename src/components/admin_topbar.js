import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const AdminTopbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) {
      setAdminName(storedUser.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-dark text-white shadow-sm" style={{ borderBottom: '1px solid #444' }}>
      <h5 className="m-0 justify-content-between align-items-center">Smart Metering Admin Dashboard</h5>
      <div className="d-flex align-items-center">
        <FaUserCircle className="me-2" size={20} />
        <span className="me-3">Welcome, <strong>{adminName || 'Admin'}</strong></span>
        <button className="btn btn-sm btn-outline-light d-flex align-items-center" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;
