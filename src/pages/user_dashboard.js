import { useEffect, useState } from 'react';
import axios from 'axios';
import UserSidebar from '../components/user_siderbar';
import UserTopbar from '../components/user_topbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [meterInfo, setMeterInfo] = useState({});
  const [usageData, setUsageData] = useState({
    units: 0,
    estimatedBill: 0,
    graphData: [],
    billingHistory: [],
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        console.error("No token found. User not logged in.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const [userRes, meterRes, usageRes] = await Promise.all([
          axios.get('http://localhost:5000/api/user/me', config),
          axios.get('http://localhost:5000/api/user/meter', config),
          axios.get('http://localhost:5000/api/user/usage', config),
        ]);

        setUserInfo(userRes.data);
        setMeterInfo(meterRes.data);
        setUsageData(usageRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">
      <div className="row">
        <div className="col-md-3 mb-3">
          <UserSidebar />
        </div>

        <div className="col-md-9">
          <UserTopbar />

          {/* Info Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5 className="text-muted">User Info</h5>
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5 className="text-muted">Meter Info</h5>
                <p><strong>Number:</strong> {meterInfo.meterNumber}</p>
                <p><strong>Type:</strong> {meterInfo.type}</p>
                <p>
                  <strong>Location:</strong>{" "}
                  {meterInfo.location?.street}, {meterInfo.location?.city},{" "}
                  {meterInfo.location?.state}
                </p>
              </div>
            </div>
          </div>

          {/* Live Consumption */}
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="text-muted mb-3">Live Consumption</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Units This Month:</strong> {usageData.units} kWh</p>
                <p><strong>Estimated Bill:</strong> ₹{usageData.estimatedBill}</p>
              </div>
              <div className="col-md-6">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={usageData.graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usage" stroke="#007bff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="text-muted mb-3">Billing History</h5>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Units</th>
                  <th>Amount</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {usageData.billingHistory?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>{item.units} kWh</td>
                    <td>₹{item.amount}</td>
                    <td><em>-</em></td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
