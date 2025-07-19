import UserSidebar from '../components/user_siderbar';
import UserTopbar from '../components/user_topbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import {useState,useEffect} from 'react';

const UserStats = () => {
  const [view, setView] = useState('daily');
  const [data, setData] = useState([]);

  const dummyUsage = {
    daily: [
      { label: 'Jun 1', value: 5 },
      { label: 'Jun 2', value: 7 },
      { label: 'Jun 3', value: 6 },
      { label: 'Jun 4', value: 8 },
      { label: 'Jun 5', value: 9 }
    ],
    weekly: [
      { label: 'Week 1', value: 42 },
      { label: 'Week 2', value: 50 },
      { label: 'Week 3', value: 38 },
      { label: 'Week 4', value: 55 }
    ],
    monthly: [
      { label: 'Jan', value: 210 },
      { label: 'Feb', value: 190 },
      { label: 'Mar', value: 230 },
      { label: 'Apr', value: 220 },
      { label: 'May', value: 240 },
      { label: 'Jun', value: 100 }
    ]
  };

  useEffect(() => {
    // For now use dummy data
    setData(dummyUsage[view]);

  }, [view]);

  return (
    <div className="container-fluid bg-light min-vh-100 p-3" style={{ minHeight: '100vh' }}>
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <UserSidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <UserTopbar />

          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-muted">Usage Statistics</h5>
              <select
                className="form-select w-auto"
                value={view}
                onChange={(e) => setView(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#28a745"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
