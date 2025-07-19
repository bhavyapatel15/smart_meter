import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin_sidebar';
import AdminTopbar from '../components/admin_topbar';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken'); 

    if (!token) {
      setError('Admin not logged in. Please login.');
      setLoading(false);
      return navigate('/admin_login'); // optional: redirect if no token
    }

    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const userToUpdate = users.find(user => user._id === id);
    const newStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`http://localhost:5000/api/admin/users/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = users.map(user =>
        user._id === id ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      filterUsers(updatedUsers, searchTerm, statusFilter);
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      alert('Failed to update user status');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterUsers(users, term, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterUsers(users, searchTerm, status);
  };

  const filterUsers = (usersList, term, status) => {
    let filtered = usersList;

    if (term) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    if (status) {
      filtered = filtered.filter(user => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminTopbar />
        <div className="p-4">
          {/* Search and Filter Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 mt-4">
            <input
              type="text"
              className="form-control bg-white text-dark border-secondary"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ maxWidth: '300px' }}
            />

            <select
              className="form-select bg-dark text-white border-secondary"
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{ maxWidth: '200px' }}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div>Loading users...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {user.status === 'active' ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/users/${user._id}`} className="btn btn-sm btn-primary me-2">
                            View Details
                          </Link>
                          <button
                            className={`btn btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(user._id)}
                          >
                            {user.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
