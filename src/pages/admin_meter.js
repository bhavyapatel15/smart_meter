import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/admin_sidebar';
import AdminTopbar from '../components/admin_topbar';
import axios from 'axios';

function AdminMeters() {
  const [meters, setMeters] = useState([]);
  const [filteredMeters, setFilteredMeters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  const fetchMeters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/meters', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeters(res.data);
      setFilteredMeters(res.data);
      console.log('METER DATA:', res.data);
    } catch (err) {
      console.error('Failed to fetch meters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterMeters(meters, term, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterMeters(meters, searchTerm, status);
  };

  const filterMeters = (meterList, term, status) => {
    let filtered = meterList;

    if (term) {
      filtered = filtered.filter((meter) =>
        meter.meterNumber.toLowerCase().includes(term) ||
        meter.owner?.name?.toLowerCase().includes(term)
      );
    }

    if (status) {
      filtered = filtered.filter((meter) => meter.status === status);
    }

    setFilteredMeters(filtered);
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminTopbar />
        <div className="p-4">
          {/* Search and Filter */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 mt-4">
            <input
              type="text"
              className="form-control bg-white text-dark border-secondary"
              placeholder="Search by meter number or user name..."
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
              <option value="faulty">Faulty</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div>Loading meter data...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Meter Number</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Last kWh Imported</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeters.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No meters found</td>
                    </tr>
                  ) : (
                    filteredMeters.map((meter, index) => (
                      <tr key={meter._id}>
                        <td>{index + 1}</td>
                        <td>{meter.meterNumber}</td>
                        <td>{meter.owner?.name || 'Unknown'}</td>
                        <td>
                          <span className={`badge ${
                            meter.status === 'active' ? 'bg-success' :
                            meter.status === 'faulty' ? 'bg-warning text-dark' :
                            'bg-secondary'
                          }`}>
                            {meter.status.charAt(0).toUpperCase() + meter.status.slice(1)}
                          </span>
                        </td>
                       <td>
                        {meter.latestReading && meter.latestReading.kWh_Imp !== undefined
                          ? meter.latestReading.kWh_Imp.toFixed(2)
                          : 'N/A'}
                      </td>
                        <td>
                          {meter.latestReading?.timestamp
                            ? new Date(meter.latestReading.timestamp).toLocaleString()
                            : 'N/A'}
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

export default AdminMeters;
