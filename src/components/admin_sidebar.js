import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaTachometerAlt as FaMeter, FaCogs } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin_dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin_users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin_meter', label: 'Meter Data', icon: <FaMeter /> },
    { path: '/admin_settings', label: 'Settings', icon: <FaCogs /> },
  ];

  return (
    <div
        className="text-white vh-100 p-3"
        style={{ width: '220px', backgroundColor: '#212529' , borderRight: '1px solid #444'}}
      >
      <div>
        <h4 className="text-center mb-4">⚡ Admin Panel</h4>
        <ul className="nav flex-column">
          {navItems.map(({ path, label, icon }) => (
            <li key={path} className="nav-item mb-2">
              <Link
                to={path}
                className={`nav-link d-flex align-items-center gap-2 text-white ${
                  location.pathname === path ? 'bg-secondary rounded' : ''
                }`}
              >
                {icon} {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center small text-muted">© 2025 SmartMeter</div>
    </div>
  );
};

export default AdminSidebar;
