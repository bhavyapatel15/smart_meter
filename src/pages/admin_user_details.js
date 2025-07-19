import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminTopbar from '../components/admin_topbar';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [meters, setMeters] = useState([]);
  const [consumption, setConsumption] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const meterRes = await axios.get(`http://localhost:5000/api/admin/users/${id}/meters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeters(meterRes.data);

        const consumptionRes = await axios.get(`http://localhost:5000/api/admin/users/${id}/consumption`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsumption(consumptionRes.data);
      } catch (err) {
        setError('⚠️ Failed to load user data');
      }
    };

    fetchData();
  }, [id]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ddd',
        },
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: '#444',
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        ticks: { color: '#bbb' },
        grid: { color: '#333' },
      },
      y: {
        ticks: { color: '#bbb' },
        grid: { color: '#333' },
      },
    },
  };

  const getChartData = (label, dataArray, type = 'line') => {
    if (!Array.isArray(dataArray)) {
      console.warn(`Invalid data for chart: ${label}`, dataArray);
      return { labels: [], datasets: [] };
    }

    return {
      labels: dataArray.map((d) => d.period),
      datasets: [
        {
          label,
          data: dataArray.map((d) => d.value),
          backgroundColor: type === 'bar' ? 'rgba(30, 144, 255, 0.7)' : 'rgba(0, 191, 255, 0.3)',
          borderColor: 'rgba(0, 191, 255, 1)',
          borderWidth: 2,
          fill: type !== 'bar',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const lastBilling = () => {
    if (!consumption?.monthly || consumption.monthly.length === 0) return null;
    const last = consumption.monthly[consumption.monthly.length - 1];
    const rate = 6;
    return {
      period: last.period,
      units: last.value.toFixed(2),
      amount: `₹${(last.value * rate).toFixed(2)}`,
    };
  };

  const billing = lastBilling();

  return (
    <div className="flex-grow-1" style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <AdminTopbar />
      <div className="container mt-4">
        <button className="btn btn-outline-light mb-3" onClick={() => navigate('/admin_users')}>
          ← Back 
        </button>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : !user ? (
          <div className="text-light">Loading...</div>
        ) : (
          <>
           <div className="card bg-gradient p-4 mb-4 border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: '#fff' }}>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-person-circle text-light" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
              <div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-2"><strong>Name:</strong> {user.name}</div>
              <div className="col-md-3 mb-2"><strong>Email:</strong> {user.email}</div>
              <div className="col-md-3 mb-2"><strong>Phone:</strong> {user.phone}</div>
              <div className="col-md-3 mb-2 mr-1"><strong>Status:</strong> <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{user.status}</span></div>
            </div>
          </div>

           <div className="card bg-gradient mb-5 p-4 border-0 shadow-lg text-center" style={{ background: 'linear-gradient(135deg, #232526, #414345)', color: '#fff' }}>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-hdd-network text-warning text-center" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
              <div className="text-center">
                <h5 className="mb-0  text-center">Linked Meters</h5>
              </div>
            </div>
            {meters.length === 0 ? (
              <p className="text-light">No meters found.</p>
            ) : (
              <div className="table-responsive mt-3">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Meter Number</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Installed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meters.map((m) => (
                      <tr key={m._id}>
                        <td>{m.meterNumber}</td>
                        <td>{m.type}</td>
                        <td>{`${m.location.street}, ${m.location.city}`}</td>
                        <td>{new Date(m.installedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
            <div className="d-flex align-items-center mb-3 mt-5">
              <i className="bi bi-bar-chart-line text-info" style={{ fontSize: '1.8rem', marginRight: '10px' }}></i>
              <h5 className="mb-0 text-light ">Consumption Statistics</h5>
            </div>
            {!consumption ? (
              <p>Loading consumption data...</p>
            ) : (
              <div className="row">
                <div className="col-md-12 mb-4">
                  <div className="card bg-dark text-white p-3 shadow-sm border-secondary">
                    <h6>Total Consumption: <strong>{consumption.total} kWh</strong></h6>
                  </div>
                </div>

                {consumption.daily?.length > 0 && (
                  <div className="col-md-4 mb-4">
                    <div className="card bg-dark text-white p-3 shadow-sm" style={{ height: '300px' }}>
                      <h6 className="mb-3">Daily</h6>
                      <Line data={getChartData('Daily', consumption.daily.slice(-7))} options={chartOptions} />
                    </div>
                  </div>
                )}

                {consumption.weekly?.length > 0 && (
                  <div className="col-md-4 mb-4">
                    <div className="card bg-dark text-white p-3 shadow-sm" style={{ height: '300px' }}>
                      <h6 className="mb-3">Weekly</h6>
                      <Bar data={getChartData('Weekly', consumption.weekly.slice(-4), 'bar')} options={chartOptions} />
                    </div>
                  </div>
                )}

                {consumption.monthly?.length > 0 && (
                  <div className="col-md-4 mb-4">
                    <div className="card bg-dark text-white p-3 shadow-sm" style={{ height: '300px' }}>
                      <h6 className="mb-3">Monthly</h6>
                      <Line data={getChartData('Monthly', consumption.monthly.slice(-6))} options={chartOptions} />
                    </div>
                  </div>
                )}

               {billing && (
                  <div className="col-md-12 mb-4">
                    <div className="card bg-gradient p-4 border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: '#fff' }}>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-receipt text-warning" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
                        <div>
                          <h5 className="mb-0">Last Billing Summary</h5>
                        </div>
                      </div>
                      <div className="row text-center">
                        <div className="col-md-4 mb-2">
                          <h6 className="text-light">Billing Month</h6>
                          <p className="fs-5">{billing.period}</p>
                        </div>
                        <div className="col-md-4 mb-2">
                          <h6 className="text-light">Units Consumed</h6>
                          <p className="fs-5">{billing.units} kWh</p>
                        </div>
                        <div className="col-md-4 mb-2">
                          <h6 className="text-light">Amount Billed</h6>
                          <p className="fs-5 text-success">{billing.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminUserDetails;
