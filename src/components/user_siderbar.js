import React from 'react';
import { FaTachometerAlt, FaChartBar, FaFileInvoice, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-white shadow p-3 rounded d-flex flex-column" style={{ minHeight: '97vh', position: 'sticky', top: 0 }}>
      <h4 className="text-primary fw-bold mb-4">SmartMeter</h4>
      <ul className="nav flex-column flex-grow-1">
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/user_dashboard">
            <FaTachometerAlt className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/user_stats">
            <FaChartBar className="me-2" /> Usage Stats
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/user_billing">
            <FaFileInvoice className="me-2" /> Billing
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/user_settings">
            <FaCog className="me-2" /> Settings
          </Link>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-link nav-link text-danger fw-semibold p-0" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
