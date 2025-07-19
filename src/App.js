import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Admin_dashboard from "./pages/admin_dashboard";
import AdminUsers from "./pages/admin_users";
import AdminMeters from "./pages/admin_meter";
import AdminSettings from "./pages/admin_settings";
import AdminUserDetails from "./pages/admin_user_details";
import AdminLogin from "./pages/admin_login";

import User_dashboard from "./pages/user_dashboard";
import UserStats from "./pages/user_stats";
import UserBilling from "./pages/user_billing";
import UserSettings from "./pages/user_settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin_dashboard" element={<Admin_dashboard />} />
        <Route path="/admin_users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
        <Route path="/admin_meter" element={<AdminMeters />} />
        <Route path="/admin_settings" element={<AdminSettings />} />
        <Route path="/admin_login" element={<AdminLogin />} />

        <Route path="/user_dashboard" element={<User_dashboard />} />
        <Route path="/user_stats" element={<UserStats />} />
        <Route path="/user_billing" element={<UserBilling />} />
        <Route path="/user_settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
