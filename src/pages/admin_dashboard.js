import { useEffect, useState } from 'react';
import AdminSidebar from '../components/admin_sidebar';
import AdminTopbar from '../components/admin_topbar';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, BarElement,
  CategoryScale, LinearScale, PointElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [meters, setMeters] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, meterRes, consumptionRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/meters', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/total-consumption', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const usersData = await userRes.json();
        const metersData = await meterRes.json();
        const consumptionData = await consumptionRes.json();

        setUsers(usersData);
        setMeters(metersData);
        setTotalConsumption(consumptionData.total || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalUsers = users.length;
  const activeMeters = meters.length;
  const faultAlerts = 0; 

  const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Energy Usage (kWh)',
    data: [420, 390, 500, 470, 520, 610, 580],
    fill: true,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderColor: '#00ff9d',
    tension: 0.4,
    pointBackgroundColor: '#00ff9d',
  }]
};

const barData = {
  labels: ['Users', 'Active Meters'],
  datasets: [{
    label: 'Count',
    data: [totalUsers, activeMeters],
    backgroundColor: ['#00bcd4', '#ffc107'],
    borderRadius: 8,
  }]
};

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#fff',
        font: {
          size: 14,
        }
      }
    },
    tooltip: {
      backgroundColor: '#222',
      titleColor: '#fff',
      bodyColor: '#fff',
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#bbb',
        font: { size: 12 }
      },
      grid: {
        color: '#333'
      }
    },
    y: {
      ticks: {
        color: '#bbb',
        font: { size: 12 }
      },
      grid: {
        color: '#333'
      }
    }
  }
};

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminTopbar />
        <div className="p-4">
         

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div className="row mb-4 mt-4">
                <div className="col-md-3 mb-3">
                  <div className="card bg-dark text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Users</h5>
                      <p className="fs-4">{totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-dark text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Active Meters</h5>
                      <p className="fs-4">{activeMeters}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-dark text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Consumption</h5>
                      <p className="fs-4">{totalConsumption} kWh</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-dark text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Alerts / Faults</h5>
                      <p className="fs-4">{faultAlerts}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark text-white shadow">
                    <div className="card-body">
                      <h5 className="card-title">Energy Usage Over Week</h5>
                      <Line data={lineData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card bg-dark text-white shadow">
                    <div className="card-body">
                      <h5 className="card-title">Users vs Active Meters</h5>
                      <Bar data={barData}  options={chartOptions}/>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
